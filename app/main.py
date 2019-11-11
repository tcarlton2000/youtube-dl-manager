from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_compress import Compress

compress = Compress()


def create_app(database_uri, debug=False):
    app = Flask(__name__)
    compress.init_app(app)
    app.debug = debug
    app.config["SQLALCHEMY_DATABASE_URI"] = database_uri
    db = SQLAlchemy(app)
    return app, db


app, db = create_app("sqlite:////config/youtube-dl.db", debug=True)
