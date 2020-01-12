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
    log = "34.7% of 102.16MiB at 144.30KiB/s ETA 07:53"

    # WHEN
    file.add_to_log(log)

    # THEN
    assert 2 == db_commit_mock.call_count
