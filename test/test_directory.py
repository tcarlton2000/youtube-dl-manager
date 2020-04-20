import json
from unittest.mock import patch
from test.utils import client


def isdir_mock(path):
    if path in ["/downloads/dir1", "/downloads/dir2", "/downloads/dir3"]:
        return True
    else:
        return False


@patch(
    "app.directory.listdir",
    return_value=["dir1", "file1", "dir2", "file2", "dir3", "file3"],
)
@patch("app.directory.isdir", side_effect=isdir_mock)
def test_get_directories(isdir_mock, listdir_mock):
    # WHEN
    resp = client.post(
        "/api/directories",
        data=json.dumps({"path": "/downloads"}),
        content_type="application/json",
    )

    # THEN
    assert resp.status == "200 OK", resp.get_json()
    assert resp.mimetype == "application/json"
    assert "directories" in resp.get_json()
    assert resp.get_json()["directories"] == ["dir1", "dir2", "dir3"]


def test_get_directories_no_path():
    # WHEN
    resp = client.post(
        "/api/directories", data=json.dumps({}), content_type="application/json"
    )

    # THEN
    assert resp.status == "400 BAD REQUEST", resp.get_json()
    assert resp.mimetype == "application/json"
    assert "error" in resp.get_json()
    assert resp.get_json()["error"] == "'path' not found in request"
