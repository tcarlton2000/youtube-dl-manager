import logging
import math

from sqlalchemy.exc import OperationalError, IntegrityError

from app.main import db
from app.status import Status
from app.type import Type

INITIAL_PAGE = 1
DEFAULT_LIMIT = 10

logger = logging.getLogger("File")


def retry(func):
    def do_retry(*args, **kwargs):
        try_retry = True
        while try_retry:
            try:
                output = func(*args, **kwargs)
                try_retry = False
            except (OperationalError, IntegrityError) as e:
                logger.exception(e)
                db.session.rollback()
        return output

    return do_retry


class File(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    directory = db.Column(db.String, nullable=False)
    url = db.Column(db.String, nullable=False)
    status_id = db.Column(
        db.Integer, db.ForeignKey("status.id"), nullable=False, index=True
    )
    type_id = db.Column(
        db.Integer, db.ForeignKey("type.id"), nullable=False, index=True
    )
    size = db.Column(db.String)
    speed = db.Column(db.String)
    percent = db.Column(db.Float, nullable=False)
    time_remaining = db.Column(db.String)

    @classmethod
    def get_all_files(cls, status=None, page=None, limit=None):
        page = int(page) if page is not None and page.isdigit() else INITIAL_PAGE
        limit = int(limit) if limit is not None and limit.isdigit() else DEFAULT_LIMIT

        query = File.filter_status(File.query, status)
        query = query.order_by(File.id.desc()).paginate(page, limit, False).items

        return {
            "downloads": [item.marshal() for item in query],
            "totalPages": File.total_pages(status, limit),
        }

    @classmethod
    def get_file(cls, file_id):
        query = File.query.filter_by(id=file_id).first()
        return query

    @classmethod
    @retry
    def new_file(cls, url, type_id, directory, name=None):
        new_file = File(
            url=url,
            name=name,
            directory=directory,
            type_id=type_id,
            status_id=Status.STATUS_IN_PROGRESS_ID,
            percent=0.0,
        )
        db.session.add(new_file)
        db.session.commit()
        logger.info(f"New download ID: {new_file.id}")
        return new_file

    @retry
    def update_db(self, stats):
        if "name" in stats:
            self.name = stats["name"]

        if "percent" in stats:
            self.percent = stats["percent"]

        if "size" in stats:
            self.size = stats["size"]

        if "speed" in stats:
            self.speed = stats["speed"]

        if "time_remaining" in stats:
            self.time_remaining = stats["time_remaining"]

        db.session.commit()

    @retry
    def complete(self):
        self.percent = 100
        self.status_id = Status.STATUS_COMPLETED_ID
        logger.info(f"{self.name} completed")
        db.session.commit()

    @retry
    def error(self):
        self.status_id = Status.STATUS_ERROR_ID
        logger.error(f"{self.name} errored")
        db.session.commit()

    @staticmethod
    def filter_status(query, status):
        if status is None:
            return query
        elif isinstance(status, list):
            status_ids = [Status.name_to_id(item) for item in status]
            return query.filter(File.status_id.in_(status_ids))
        else:
            return query.filter(File.status_id == Status.name_to_id(status))

    @staticmethod
    def total_pages(status, limit):
        total_count = File.filter_status(
            db.session.query(db.func.count(File.id)), status
        ).scalar()
        return math.ceil(total_count / limit) or 1

    def marshal(self):
        return {
            "id": self.id,
            "name": self.name,
            "url": self.url,
            "directory": self.directory,
            "status": Status.id_to_name(self.status_id),
            "type": Type.id_to_name(self.type_id),
            "percent": self.percent,
            "size": self.size,
            "speed": self.speed,
            "timeRemaining": self.time_remaining,
        }
