import json
from flask import request, Response
from werkzeug.exceptions import NotFound

import errors  # noqa: F401
from app import app, db
from file import File
from download import Download


def json_response(payload, status):
    return Response(json.dumps(payload),
                    status=status,
                    mimetype="application/json")


@app.route('/downloads', methods=['GET', 'POST'])
def downloads():
    if request.method == "POST":
        body = request.json
        resp = start_download(body["url"], body.get("directory", None))
        return json_response(resp, 201)
    else:
        files = File.get_all_files()
        return json_response(files, 200)


@app.route('/downloads/<int:file_id>')
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
    return {
        "id": download.id
    }


if __name__ == "__main__":
    db.create_all()
    app.run(host='0.0.0.0', port=5000)
