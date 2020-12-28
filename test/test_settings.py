import json

from app.settings import Settings

from test.db_mock import reset_db, create_new_setting
from test.utils import client, db


def test_get_settings_loads_db_settings():
    # GIVEN
    reset_db(db)
    create_new_setting(db, "downloadDirectory", "/testing")

    # WHEN
    resp = client.get("/api/settings")

    # THEN
    assert resp.status == "200 OK", resp.get_json()
    assert resp.mimetype == "application/json"

    assert resp.get_json() == {"settings": {"downloadDirectory": "/testing"}}


def test_get_settings_loads_missing_settings():
    # GIVEN
    reset_db(db)

    # WHEN
    resp = client.get("/api/settings")

    # THEN
    assert resp.status == "200 OK", resp.get_json()
    assert resp.mimetype == "application/json"

    assert resp.get_json() == {"settings": {"downloadDirectory": "/downloads"}}


def test_create_new_setting():
    # GIVEN
    reset_db(db)

    # WHEN
    resp = client.post(
        "/api/settings",
        data=json.dumps({"settings": {"downloadDirectory": "/changed"}}),
        content_type="application/json",
    )

    # THEN
    assert resp.status == "201 CREATED", resp.get_json()
    assert resp.mimetype == "application/json"

    setting = (
        db.session.query(Settings).filter(Settings.key == "downloadDirectory").first()
    )
    assert setting is not None
    assert setting.value == "/changed"


def test_updating_existing_setting():
    # GIVEN
    reset_db(db)
    create_new_setting(db, key="downloadDirectory", value="/alreadyhere")

    # WHEN
    resp = client.post(
        "/api/settings",
        data=json.dumps({"settings": {"downloadDirectory": "/changed"}}),
        content_type="application/json",
    )

    # THEN
    assert resp.status == "201 CREATED", resp.get_json()
    assert resp.mimetype == "application/json"

    setting = (
        db.session.query(Settings).filter(Settings.key == "downloadDirectory").first()
    )
    assert setting is not None
    assert setting.value == "/changed"
