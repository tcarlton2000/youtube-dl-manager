from app.main import db


class Type(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)

    TYPE_YOUTUBE_ID = 1
    TYPE_GALLERY_ID = 2
    TYPE_SW_ID = 3

    TYPE_YOUTUBE_NAME = "Youtube"
    TYPE_GALLERY_NAME = "Gallery"
    TYPE_SW_NAME = "SW"

    TYPE_NAME_TO_ID_MAP = {
        TYPE_YOUTUBE_NAME: TYPE_YOUTUBE_ID,
        TYPE_GALLERY_NAME: TYPE_GALLERY_ID,
        TYPE_SW_NAME: TYPE_SW_ID,
    }

    TYPE_ID_TO_NAME_MAP = {
        TYPE_YOUTUBE_ID: TYPE_YOUTUBE_NAME,
        TYPE_GALLERY_ID: TYPE_GALLERY_NAME,
        TYPE_SW_ID: TYPE_SW_NAME,
    }

    @classmethod
    def id_to_name(cls, _id):
        return cls.TYPE_ID_TO_NAME_MAP[_id]

    @classmethod
    def name_to_id(cls, name):
        return cls.TYPE_NAME_TO_ID_MAP[name]
