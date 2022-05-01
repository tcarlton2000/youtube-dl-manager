import json
import pytest
from unittest.mock import MagicMock, patch

from test.utils import client


@pytest.mark.parametrize(
    "downloader,sw_is_valid,youtube_is_valid,"
    "gallery_is_valid,expected_status,expected_downloader",
    [
        ("auto", 1, 0, 0, "201 CREATED", "sw"),
        ("auto", 0, 1, 0, "201 CREATED", "youtube"),
        ("auto", 0, 0, 1, "201 CREATED", "gallery"),
        ("auto", 0, 0, 0, "400 BAD REQUEST", ""),
        (None, 1, 0, 0, "201 CREATED", "sw"),
        (None, 0, 1, 0, "201 CREATED", "youtube"),
        (None, 0, 0, 1, "201 CREATED", "gallery"),
        (None, 0, 0, 0, "400 BAD REQUEST", ""),
        ("sw", 0, 0, 0, "201 CREATED", "sw"),
        ("youtube", 0, 0, 0, "201 CREATED", "youtube"),
        ("gallery", 0, 0, 0, "201 CREATED", "gallery"),
        ("SW", 0, 0, 0, "201 CREATED", "sw"),
        ("YOUTUBE", 0, 0, 0, "201 CREATED", "youtube"),
        ("GALLERY", 0, 0, 0, "201 CREATED", "gallery"),
        ("blah", 0, 0, 0, "400 BAD REQUEST", ""),
    ],
)
@patch("app.downloaders.get_downloader.SWDownload")
@patch("app.downloaders.get_downloader.GalleryDownload")
@patch("app.downloaders.get_downloader.YoutubeDownload")
def test_downloader(
    mock_youtube_download,
    mock_gallery_download,
    mock_sw_download,
    downloader,
    expected_status,
    sw_is_valid,
    youtube_is_valid,
    gallery_is_valid,
    expected_downloader,
):
    # GIVEN
    mock_sw_object = MagicMock(is_valid=MagicMock(return_value=sw_is_valid), id=1)
    mock_youtube_object = MagicMock(
        is_valid=MagicMock(return_value=youtube_is_valid), id=1
    )
    mock_gallery_object = MagicMock(
        is_valid=MagicMock(return_value=gallery_is_valid), id=1
    )

    mock_sw_download.return_value = mock_sw_object
    mock_youtube_download.return_value = mock_youtube_object
    mock_gallery_download.return_value = mock_gallery_object

    downloader_payload = {"url": "https://youtube.com/blah"}
    if downloader is not None:
        downloader_payload["downloader"] = downloader

    # WHEN
    resp = client.post(
        "api/downloads",
        data=json.dumps(downloader_payload),
        content_type="application/json",
    )

    # THEN
    assert resp.status == expected_status, resp.get_json()
    assert resp.mimetype == "application/json"

    if expected_downloader == "sw":
        mock_sw_download.assert_called_once()
    else:
        mock_sw_object.assert_not_called()

    if expected_downloader == "youtube":
        mock_youtube_download.assert_called_once()
    else:
        mock_youtube_object.assert_not_called()

    if expected_downloader == "gallery":
        mock_gallery_download.assert_called_once()
    else:
        mock_gallery_object.assert_not_called()
