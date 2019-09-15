import json
import os
import pytest

from app import youtube
from test.db_mock import create_new_file, mock_db_calls

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

    assert resp.status == "201 CREATED", resp.get_json()
    assert resp.mimetype == "application/json"
    assert "id" in resp.get_json()
    _id = resp.json["id"]

    get_resp = client.get("/downloads/{}".format(_id))
    prev_percent = 0.0
    while get_resp.get_json()["status"] != "Completed":
        assert get_resp.get_json()["status"] != "Error"
        assert get_resp.get_json()["percent"] >= prev_percent
        prev_percent = get_resp.get_json()["percent"]
        get_resp = client.get("/downloads/{}".format(_id))

    print(get_resp.get_json())

    assert get_resp.get_json()["name"] in possible_download_names
    assert get_resp.get_json()["directory"] == "."
    assert get_resp.get_json()["percent"] == 100.0
    assert get_resp.get_json()["timeRemaining"] == "00:00"
    assert get_resp.get_json()["size"] != ""
    assert get_resp.get_json()["speed"] != ""

    filename = get_resp.get_json()["name"]
    assert os.path.isfile(filename)


def test_get_download_list():
    resp = client.get("/downloads")
    assert resp.status == "200 OK", resp.get_json()
    assert resp.mimetype == "application/json"

    json_resp = resp.get_json()
    assert "downloads" in json_resp
    assert len(json_resp["downloads"]) > 0

    urls = [item["url"] for item in json_resp["downloads"]]
    assert "https://www.youtube.com/watch?v=nTfCxORgKEk" in urls


@pytest.mark.parametrize(
    "page,limit,expected_limit,total_pages,status",
    [
        (1, None, 10, 2, "In Progress"),
        (2, None, 10, 2, "Completed"),
        (None, 5, 5, 4, "In Progress"),
        ("cow", "pig", 10, 2, "In Progress"),
    ],
)
def test_download_list_pagination(page, limit, expected_limit, total_pages, status):
    total_count = 20
    mock_db_calls(youtube.db, total_count)
    if limit is None:
        resp = client.get("downloads?page={}".format(page))
    elif page is None:
        resp = client.get("downloads?limit={}".format(limit))
    else:
        resp = client.get("downloads?page={}&limit={}".format(page, limit))

    assert resp.status == "200 OK", resp.get_json()
    assert resp.mimetype == "application/json"

    json_resp = resp.get_json()
    assert "downloads" in json_resp

    assert len(json_resp["downloads"]) == expected_limit
    assert all([download["status"] == status for download in json_resp["downloads"]])

    assert "totalPages" in json_resp
    assert json_resp["totalPages"] == total_pages


def test_get_download_not_found():
    resp = client.get("/downloads/9999")
    assert resp.status == "404 NOT FOUND"


@pytest.mark.parametrize(
    "log,field,value",
    [
        ("34.7% of 102.16MiB at 144.30KiB/s ETA 07:53", "percent", 34.7),
        ("34.7% of 102.16MiB at 144.30KiB/s ETA 07:53", "size", "102.16MiB"),
        ("34.7% of 102.16MiB at 144.30KiB/s ETA 07:53", "speed", "144.30KiB/s"),
        ("34.7% of 102.16MiB at 144.30KiB/s ETA 07:53", "time_remaining", "07:53"),
        (
            "34.7% of 102.16MiB at 144.30KiB/s ETA 01:07:53",
            "time_remaining",
            "01:07:53",
        ),
    ],
)
def test_log_parsing(log, field, value):
    file = create_new_file(youtube.db)
    file.add_to_log(log)

    assert getattr(file, field) == value


def test_index():
    resp = client.get("/")
    assert resp.status == "200 OK", resp.get_json()
    assert resp.mimetype == "text/html"
    assert "<html>" in str(resp.get_data())
