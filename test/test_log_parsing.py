import pytest

from test.utils import db
from test.db_mock import create_new_file


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
def test_stat_parsing(log, field, value):
    # GIVEN
    file = create_new_file(db)

    # WHEN
    file.add_to_log(log)

    # THEN
    assert getattr(file, field) == value


@pytest.mark.parametrize(
    "log,field,value",
    [
        ("34.7% of ~102.16MiB at 144.30KiB/s ETA 07:53", "percent", 34.7),
        ("34.7% of ~102.16MiB at 144.30KiB/s ETA 07:53", "size", "~102.16MiB"),
        ("34.7% of ~102.16MiB at 144.30KiB/s ETA 07:53", "speed", "144.30KiB/s"),
        ("34.7% of ~102.16MiB at 144.30KiB/s ETA 07:53", "time_remaining", "07:53"),
        (
            "34.7% of ~102.16MiB at 144.30KiB/s ETA 01:07:53",
            "time_remaining",
            "01:07:53",
        ),
    ],
)
def test_ambiguous_stat_parsing(log, field, value):
    # GIVEN
    file = create_new_file(db)

    # WHEN
    file.add_to_log(log)

    # THEN
    assert getattr(file, field) == value


@pytest.mark.parametrize(
    "log,name",
    [
        ("[download] Destination: New Video.mp4", "New Video.mp4"),
        (
            "[download] Duplicate Video.mkv has already been downloaded and merged",
            "Duplicate Video.mkv",
        ),
    ],
)
def test_name_parsing(log, name):
    # GIVEN
    file = create_new_file(db, name=None)

    # WHEN
    file.add_to_log(log)

    # THEN
    assert file.name == name
