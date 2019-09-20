import math
import re

from app.main import db

INITIAL_PAGE = 1
DEFAULT_LIMIT = 10


class File(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    directory = db.Column(db.String, nullable=False)
    url = db.Column(db.String, nullable=False)
    status = db.Column(db.String, nullable=False)
    log = db.Column(db.String, nullable=False)
    size = db.Column(db.String)
    speed = db.Column(db.String)
    percent = db.Column(db.Float, nullable=False)
    time_remaining = db.Column(db.String)

    @classmethod
    def get_all_files(cls, page=None, limit=None):
        page = int(page) if page is not None and page.isdigit() else INITIAL_PAGE
        limit = int(limit) if limit is not None and limit.isdigit() else DEFAULT_LIMIT
        query = File.query.order_by(File.id.desc()).paginate(page, limit, False).items
        return {
            "downloads": [item.list_marshal() for item in query],
            "totalPages": File.total_pages(limit),
        }

    @classmethod
    def get_file(cls, file_id):
        query = File.query.filter_by(id=file_id).first()
        return query

    @classmethod
    def new_file(cls, url, directory):
        new_file = File(
            url=url, directory=directory, status="In Progress", log="", percent=0.0
        )
        db.session.add(new_file)
        db.session.commit()
        return new_file

    def add_to_log(self, line):
        self.log += line
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
            elif completed_name_re:
                self.name = completed_name_re.group(1)

    def parse_stats(self, line):
        status_re = re.search(
            r"(\d+\.\d+)%\s+of\s+(\d+\.\d+\w+)\s"
            r"+at\s+(\d+\.\d+.+)\s+ETA\s+((\d+:)?\d+:\d+)",
            line,
        )
        if status_re:
            self.percent = float(status_re.group(1))
            self.size = status_re.group(2)
            self.speed = status_re.group(3)
            self.time_remaining = status_re.group(4)

    def complete(self):
        self.status = "Completed"
        db.session.commit()

    def error(self):
        self.status = "Error"
        db.session.commit()

    def list_marshal(self):
        return {
            "id": self.id,
            "name": self.name,
            "url": self.url,
            "directory": self.directory,
            "status": self.status,
            "percent": self.percent,
            "size": self.size,
            "speed": self.speed,
            "timeRemaining": self.time_remaining,
        }

    @staticmethod
    def total_pages(limit):
        total_count = db.session.query(db.func.count(File.id)).scalar()
        return math.ceil(total_count / limit) or 1

    def marshal(self):
        return {
            "id": self.id,
            "name": self.name,
            "url": self.url,
            "directory": self.directory,
            "status": self.status,
            "percent": self.percent,
            "size": self.size,
            "speed": self.speed,
            "timeRemaining": self.time_remaining,
            "log": self.log,
        }
