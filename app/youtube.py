import json

from flask import Response, request, render_template
from werkzeug.exceptions import NotFound

from app import errors  # noqa: F401
from app.download import Download
from app.file import File
from app.main import app, db


def json_response(payload, status):
    return Response(json.dumps(payload), status=status, mimetype="application/json")


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/downloads", methods=["GET", "POST"])
def downloads():
    if request.method == "POST":
        body = request.json
        resp = start_download(body["url"], body.get("directory", None))
        return json_response(resp, 201)
    else:
        status = request.args.get("status", None)
        if status is not None and "," in status:
            status = status.split(",")

        files = File.get_all_files(
            status=status,
            page=request.args.get("page", None),
            limit=request.args.get("limit", None),
        )
        return json_response(files, 200)


@app.route("/downloads/<int:file_id>")
def download(file_id):
    _file = File.get_file(file_id)
    if _file is None:
        raise NotFound
    return json_response(_file.marshal(), 200)


def start_download(url, directory):
    download = Download(url, directory=directory)
    download.start()
    while download.id is None:
        pass
    return {"id": download.id}


if __name__ == "__main__":
    db.create_all()
    app.run(host="0.0.0.0", port=5000)
