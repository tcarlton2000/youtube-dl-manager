import os
import json
import pytest

from test.utils import client, db
from test.db_mock import create_file_list

possible_download_names = [
    "The Meta-Crisis Tenth Doctor _ Journey's End _ Doctor Who-nTfCxORgKEk.webm",
    "The Meta-Crisis Tenth Doctor _ Journey's End _ Doctor Who-nTfCxORgKEk.f135.mp4",
    "The Meta-Crisis Tenth Doctor _ Journey's End _ Doctor Who-nTfCxORgKEk.mp4",
]


def test_download_file():
    # WHEN
    resp = client.post(
        "/api/downloads",
        data=json.dumps(
            {"url": "https://www.youtube.com/watch?v=nTfCxORgKEk", "directory": "."}
        ),
        content_type="application/json",
    )

    # THEN
    assert resp.status == "201 CREATED", resp.get_json()
    assert resp.mimetype == "application/json"
    assert "id" in resp.get_json()
    _id = resp.json["id"]

    # WHEN
    get_resp = client.get("/api/downloads/{}".format(_id))

    # THEN
    prev_percent = 0.0
    while get_resp.get_json()["status"] != "Completed":
        assert get_resp.get_json()["status"] != "Error"
        assert get_resp.get_json()["percent"] >= prev_percent
        prev_percent = get_resp.get_json()["percent"]
        get_resp = client.get("/api/downloads/{}".format(_id))

    assert get_resp.get_json()["name"] in possible_download_names
    assert get_resp.get_json()["directory"] == "."
    assert get_resp.get_json()["percent"] == 100.0
    assert get_resp.get_json()["timeRemaining"] == "00:00"
    assert get_resp.get_json()["size"] != ""
    assert get_resp.get_json()["speed"] != ""

    filename = get_resp.get_json()["name"]
    assert os.path.isfile(filename)


def test_get_download_list():
    # WHEN
    resp = client.get("/api/downloads")

    # THEN
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
    # GIVEN
    create_file_list(db, in_progress_count=10, completed_count=10)

    # WHEN
    if limit is None:
        resp = client.get("/api/downloads?page={}".format(page))
    elif page is None:
        resp = client.get("/api/downloads?limit={}".format(limit))
    else:
        resp = client.get("/api/downloads?page={}&limit={}".format(page, limit))

    # THEN
    assert resp.status == "200 OK", resp.get_json()
    assert resp.mimetype == "application/json"

    json_resp = resp.get_json()
    assert "downloads" in json_resp

    assert len(json_resp["downloads"]) == expected_limit
    assert all([download["status"] == status for download in json_resp["downloads"]])

    assert "totalPages" in json_resp
    assert json_resp["totalPages"] == total_pages


@pytest.mark.parametrize("filters", [["In Progress"], ["Completed", "Error"]])
def test_download_list_status_filter(filters):
    # GIVEN
    create_file_list(db, in_progress_count=5, completed_count=5)
    param = ",".join(filters)

    # WHEN
    resp = client.get("/api/downloads?status={}".format(param))

    # THEN
    assert resp.status == "200 OK", resp.get_json()
    assert resp.mimetype == "application/json"

    json_resp = resp.get_json()
    assert "downloads" in json_resp

    assert len(json_resp["downloads"]) == 5
    assert all(download["status"] in filters for download in json_resp["downloads"])


def test_get_download_not_found():
    # WHEN
    resp = client.get("/api/downloads/9999")

    # THEN
    assert resp.status == "404 NOT FOUND"
