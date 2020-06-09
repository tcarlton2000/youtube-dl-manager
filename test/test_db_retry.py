from sqlalchemy.exc import OperationalError
from unittest.mock import patch

from test.utils import db
from test.db_mock import create_new_file


@patch(
    "app.file.db.session.commit", side_effect=[OperationalError(None, None, None), None]
)
def test_retry(db_commit_mock):
    # GIVEN
    file = create_new_file(db)
    stats = {
        "percent": 34.7,
        "size": "102.16MiB",
        "speed": "144.30KiB/s",
        "time_remaining": "07:53",
    }

    # WHEN
    file.update_db(stats)

    # THEN
    assert 2 == db_commit_mock.call_count
