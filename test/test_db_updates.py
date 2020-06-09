import pytest

from test.utils import db
from test.db_mock import create_new_file


@pytest.mark.parametrize(
    "stats",
    [
        (
            {
                "name": "Filename",
                "percent": 12.3,
                "size": "102.12MiB",
                "speed": "123.23KiB/s",
                "time_remaining": "23:32",
            }
        ),
        ({"name": "Name only"}),
    ],
)
def test_db_updates(stats):
    # GIVEN
    file = create_new_file(db)

    # WHEN
    file.update_db(stats)

    # THEN
    for field, expected_value in stats.items():
        assert getattr(file, field) == expected_value
