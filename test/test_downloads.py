import pytest

from test.utils import client, db
from test.db_mock import create_file_list


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
