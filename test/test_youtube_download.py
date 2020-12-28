import pytest
from unittest.mock import patch, MagicMock

from app.downloaders.youtube_download import subprocess, YoutubeDownload

from test.db_mock import reset_db, create_new_setting
from test.utils import db


@pytest.mark.parametrize(
    "log,stats",
    [
        (
            "34.7% of 102.16MiB at 144.30KiB/s ETA 07:53",
            {
                "percent": 34.7,
                "size": "102.16MiB",
                "speed": "144.30KiB/s",
                "time_remaining": "07:53",
            },
        ),
        (
            "34.7% of ~102.16MiB at 144.30KiB/s ETA 01:07:53",
            {
                "percent": 34.7,
                "size": "~102.16MiB",
                "speed": "144.30KiB/s",
                "time_remaining": "01:07:53",
            },
        ),
    ],
)
def test_stat_parsing(log, stats):
    # WHEN
    value = YoutubeDownload.parse_stats(log)

    # THEN
    assert stats == value


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
    # WHEN
    value = YoutubeDownload.parse_name(log, 0)

    # THEN
    assert {"name": name} == value


@patch.object(
    subprocess,
    "Popen",
    return_value=MagicMock(
        stdout=MagicMock(readline=MagicMock(return_value="")),
        poll=MagicMock(return_value=0),
    ),
)
def test_download_setting_in_database(popen_mock):
    # GIVEN
    reset_db(db)
    create_new_setting(db, key="downloadDirectory", value="/database")
    url = "https://www.youtube.com/watch?v=nTfCxORgKEk"

    # WHEN
    download = YoutubeDownload(url)
    download.run()

    # THEN
    popen_mock.assert_called_with(
        ["youtube-dl", "--no-mtime", url],
        cwd="/database",
        universal_newlines=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )


@patch("app.downloaders.youtube_download.os.system")
@pytest.mark.parametrize(
    "os_system_return,expected_is_valid", [(0, True), (256, False)]
)
def test_is_valid(mock_os_system, os_system_return, expected_is_valid):
    # GIVEN
    mock_os_system.return_value = os_system_return
    url = "https://www.youtube.com/watch/1234"

    # WHEN
    download = YoutubeDownload(url)
    is_valid = download.is_valid()

    # THEN
    mock_os_system.assert_called_with(f"youtube-dl --skip-download {url}")
    assert is_valid == expected_is_valid
