import json
import logging
import os

from flask import Response, request, render_template, jsonify
from werkzeug.exceptions import BadRequest, NotFound

from app import errors  # noqa: F401
from app.directory import get_directories_in_path
from app.downloaders.get_downloader import get_downloader
from app.file import File
from app.settings import Settings
from app.main import app, db

logFormatter = "%(asctime)s - %(levelname)s - %(message)s"
logging.basicConfig(format=logFormatter, level=os.environ.get("LOGLEVEL", "INFO"))


def json_response(payload, status):
    return Response(json.dumps(payload), status=status, mimetype="application/json")


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def index(path):
    return render_template("index.html")


@app.route("/api/downloads", methods=["GET"])
def get_downloads():
    status = request.args.get("status", None)
    if status is not None and "," in status:
        status = status.split(",")

    files = File.get_all_files(
        status=status,
        page=request.args.get("page", None),
        limit=request.args.get("limit", None),
    )
    return json_response(files, 200)


@app.route("/api/downloads", methods=["POST"])
def new_download():
    body = request.json
    resp = start_download(body["url"], body.get("directory", None))
    return json_response(resp, 201)


@app.route("/api/downloads/<int:file_id>")
def download(file_id):
    _file = File.get_file(file_id)
    if _file is None:
        raise NotFound
    return json_response(_file.marshal(), 200)


def start_download(url, directory):
    download = get_downloader(url, directory=directory)
    if download is None:
        raise BadRequest

    download.start()
    while download.id is None:
        pass
    return {"id": download.id}


@app.route("/api/settings", methods=["GET"])
def get_settings():
    return json_response(Settings.get_settings(), 200)


@app.route("/api/settings", methods=["POST"])
def change_settings():
    body = request.json
    Settings.update_settings(body)
    return json_response({}, 201)


@app.route("/api/directories", methods=["POST"])
def get_directories():
    body = request.json

    if "path" not in body:
        return jsonify({"error": "'path' not found in request"}), 400

    return json_response(get_directories_in_path(body["path"]), 200)


if __name__ == "__main__":
    db.create_all()
    app.run(host="0.0.0.0", port=5000)
