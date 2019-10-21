from app import youtube


youtube.app.config["TESTING"] = True
youtube.app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///test.db"
youtube.db.create_all()
client = youtube.app.test_client()
db = youtube.db
