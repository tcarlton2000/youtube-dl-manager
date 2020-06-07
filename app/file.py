import logging
import math
import re

from sqlalchemy.exc import OperationalError, IntegrityError

from app.main import db
from app.status import Status

INITIAL_PAGE = 1
DEFAULT_LIMIT = 10

logger = logging.getLogger("File")


def retry(func):
    def do_retry(*args):
        retry = True
        while retry:
            try:
                output = func(*args)
                retry = False
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
            "downloads": [item.list_marshal() for item in query],
            "totalPages": File.total_pages(status, limit),
        }

    @classmethod
    def get_file(cls, file_id):
        query = File.query.filter_by(id=file_id).first()
        return query

    @classmethod
    @retry
    def new_file(cls, url, directory):
        new_file = File(
            url=url,
            directory=directory,
            status_id=Status.STATUS_IN_PROGRESS_ID,
            percent=0.0,
        )
        db.session.add(new_file)
        db.session.commit()
        logger.info(f"New download ID: {new_file.id}")
        return new_file

    @retry
    def add_to_log(self, line):
        self.parse_name(line)
        self.parse_stats(line)
        db.session.commit()

    def parse_name(self, line):
        if self.name is None:
            starting_name_re = re.search(r"Destination: (.*)", line)
            completed_name_re = re.search(
                r"\[download\] (.*) has already been downloaded and merged", line
            )
            if starting_name_re:
                self.name = starting_name_re.group(1)
                logger.info(f"Found name for ID({self.id}): {self.name}")
            elif completed_name_re:
                self.name = completed_name_re.group(1)

    def parse_stats(self, line):
        status_re = re.search(
            r"(\d+\.\d+)%\s+of\s+(~?\d+\.\d+\w+)\s"
            r"+at\s+(\d+\.\d+.+)\s+ETA\s+((\d+:)?\d+:\d+)",
            line,
        )
        if status_re:
            self.percent = float(status_re.group(1))
            self.size = status_re.group(2)
            self.speed = status_re.group(3)
            self.time_remaining = status_re.group(4)

    @retry
    def complete(self):
        self.status_id = Status.STATUS_COMPLETED_ID
        logger.info(f"{self.name} completed")
        db.session.commit()

    @retry
    def error(self):
        self.status_id = Status.STATUS_ERROR_ID
        logger.error(f"{self.name} errored")
        db.session.commit()

    def list_marshal(self):
        return {
            "id": self.id,
            "name": self.name,
            "url": self.url,
            "directory": self.directory,
            "status": Status.id_to_name(self.status_id),
            "percent": self.percent,
            "size": self.size,
            "speed": self.speed,
            "timeRemaining": self.time_remaining,
        }

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
            "percent": self.percent,
            "size": self.size,
            "speed": self.speed,
            "timeRemaining": self.time_remaining,
        }
