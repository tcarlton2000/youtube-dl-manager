from app.main import db


class Status(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)

    STATUS_IN_PROGRESS_ID = 1
    STATUS_COMPLETED_ID = 2
    STATUS_ERROR_ID = 3

    STATUS_IN_PROGRESS_NAME = "In Progress"
    STATUS_COMPLETED_NAME = "Completed"
    STATUS_ERROR_NAME = "Error"

    STATUS_NAME_TO_ID_MAP = {
        STATUS_IN_PROGRESS_NAME: STATUS_IN_PROGRESS_ID,
        STATUS_COMPLETED_NAME: STATUS_COMPLETED_ID,
        STATUS_ERROR_NAME: STATUS_ERROR_ID,
    }

    STATUS_ID_TO_NAME_MAP = {
        STATUS_IN_PROGRESS_ID: STATUS_IN_PROGRESS_NAME,
        STATUS_COMPLETED_ID: STATUS_COMPLETED_NAME,
        STATUS_ERROR_ID: STATUS_ERROR_NAME,
    }

    @classmethod
    def id_to_name(cls, _id):
        return cls.STATUS_ID_TO_NAME_MAP[_id]

    @classmethod
    def name_to_id(cls, name):
        return cls.STATUS_NAME_TO_ID_MAP[name]
