import pytest

from app.youtube_download import YoutubeDownload


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
