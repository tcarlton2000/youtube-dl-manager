from flask import Flask
from flask_sqlalchemy import SQLAlchemy


def create_app(database_uri, debug=False):
    app = Flask(__name__)
    app.debug = debug
    app.config["SQLALCHEMY_DATABASE_URI"] = database_uri
    db = SQLAlchemy(app)
    return app, db


app, db = create_app("sqlite:////app/youtube-dl.db", debug=True)
