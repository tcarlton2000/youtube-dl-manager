import json
import os

from app import youtube

youtube.app.config["TESTING"] = True
youtube.app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///test.db"
youtube.db.create_all()
client = youtube.app.test_client()


possible_download_names = [
    "The Meta-Crisis Tenth Doctor _ Journey's End _ Doctor Who-nTfCxORgKEk.webm",
    "The Meta-Crisis Tenth Doctor _ Journey's End _ Doctor Who-nTfCxORgKEk.f135.mp4",
    "The Meta-Crisis Tenth Doctor _ Journey's End _ Doctor Who-nTfCxORgKEk.mp4",
]


def test_download_file():
    resp = client.post(
        "/downloads",
        data=json.dumps(
            {"url": "https://www.youtube.com/watch?v=nTfCxORgKEk", "directory": "."}
        ),
        content_type="application/json",
    )

    assert resp.status == "201 CREATED"
    assert resp.mimetype == "application/json"
    assert "id" in resp.get_json()
    _id = resp.json["id"]

    get_resp = client.get("/downloads/{}".format(_id))
    while get_resp.get_json()["status"] != "Completed":
        assert get_resp.get_json()["status"] != "Error"
        get_resp = client.get("/downloads/{}".format(_id))

    print(get_resp.get_json())

    assert get_resp.get_json()["name"] in possible_download_names
    assert get_resp.get_json()["directory"] == "."

    filename = get_resp.get_json()["name"].replace(".f135.mp4", ".mkv")
    assert os.path.isfile(filename)


def test_get_download_list():
    resp = client.get("/downloads")
    assert resp.status == "200 OK"
    assert resp.mimetype == "application/json"

    json_resp = resp.get_json()
    assert len(json_resp) > 0

    urls = [item["url"] for item in json_resp]
    assert "https://www.youtube.com/watch?v=nTfCxORgKEk" in urls


def test_get_download_not_found():
    resp = client.get("/downloads/9999")
    assert resp.status == "404 NOT FOUND"


def test_index():
    resp = client.get("/")
    assert resp.status == "200 OK"
    assert resp.mimetype == "text/html"
    assert "<html>" in str(resp.get_data())
