import os
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


config_dir = os.getenv("CONFIG", "/config")
app, db = create_app(f"sqlite:///{config_dir}/download-manager.db", debug=True)
