import re

from app.main import db


class File(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    directory = db.Column(db.String, nullable=False)
    url = db.Column(db.String, nullable=False)
    status = db.Column(db.String, nullable=False)
    log = db.Column(db.String, nullable=False)

    @classmethod
    def get_all_files(cls):
        query = File.query.all()
        return [item.list_marshal() for item in query]

    @classmethod
    def get_file(cls, file_id):
        query = File.query.filter_by(id=file_id).first()
        return query

    @classmethod
    def new_file(cls, url, directory):
        new_file = File(url=url, directory=directory, status="In Progress", log="")
        db.session.add(new_file)
        db.session.commit()
        return new_file

    def add_to_log(self, line):
        self.log += line

        if self.name is None:
            name_re = re.search(r"Destination: (.*)", line)
            if name_re:
                self.name = name_re.group(1)

        db.session.commit()

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
        }

    def marshal(self):
        return {
            "id": self.id,
            "name": self.name,
            "url": self.url,
            "directory": self.directory,
            "status": self.status,
            "log": self.log,
        }
