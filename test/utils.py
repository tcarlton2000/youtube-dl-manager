import os

os.environ["DOWNLOAD_TYPE"] = "youtube"
from app import api  # noqa: F402


api.app.config["TESTING"] = True
api.app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///test.db"
api.db.create_all()
client = api.app.test_client()
db = api.db
