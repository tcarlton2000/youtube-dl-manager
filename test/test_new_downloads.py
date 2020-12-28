import json
from unittest.mock import MagicMock, patch

from test.utils import client


@patch("app.downloaders.get_downloader.SWDownload")
@patch("app.downloaders.get_downloader.GalleryDownload")
@patch("app.downloaders.get_downloader.YoutubeDownload")
def test_new_youtube_download(
    mock_youtube_download, mock_gallery_download, mock_sw_download
):
    # GIVEN
    mock_sw_object = MagicMock(is_valid=MagicMock(return_value=False), id=1)
    mock_youtube_object = MagicMock(is_valid=MagicMock(return_value=True), id=1)
    mock_gallery_object = MagicMock(is_valid=MagicMock(return_value=False), id=1)

    mock_sw_download.return_value = mock_sw_object
    mock_youtube_download.return_value = mock_youtube_object
    mock_gallery_download.return_value = mock_gallery_object

    # WHEN
    resp = client.post(
        "api/downloads",
        data=json.dumps({"url": "https://youtube.com/blah"}),
        content_type="application/json",
    )

    # THEN
    assert resp.status == "201 CREATED", resp.get_json()
    assert resp.mimetype == "application/json"

    mock_sw_download.assert_called_once()
    mock_youtube_download.assert_called_once()
    mock_gallery_download.assert_not_called()

    mock_sw_object.is_valid.assert_called_once()
    mock_youtube_object.is_valid.assert_called_once()
    mock_gallery_object.is_valid.assert_not_called()


@patch("app.downloaders.get_downloader.SWDownload")
@patch("app.downloaders.get_downloader.GalleryDownload")
@patch("app.downloaders.get_downloader.YoutubeDownload")
def test_new_gallery_download(
    mock_youtube_download, mock_gallery_download, mock_sw_download
):
    # GIVEN
    mock_sw_object = MagicMock(is_valid=MagicMock(return_value=False), id=1)
    mock_youtube_object = MagicMock(is_valid=MagicMock(return_value=False), id=1)
    mock_gallery_object = MagicMock(is_valid=MagicMock(return_value=True), id=1)

    mock_sw_download.return_value = mock_sw_object
    mock_youtube_download.return_value = mock_youtube_object
    mock_gallery_download.return_value = mock_gallery_object

    # WHEN
    resp = client.post(
        "api/downloads",
        data=json.dumps({"url": "https://youtube.com/blah"}),
        content_type="application/json",
    )

    # THEN
    assert resp.status == "201 CREATED", resp.get_json()
    assert resp.mimetype == "application/json"

    mock_sw_download.assert_called_once()
    mock_youtube_download.assert_called_once()
    mock_gallery_download.assert_called_once()

    mock_sw_object.is_valid.assert_called_once()
    mock_youtube_object.is_valid.assert_called_once()
    mock_gallery_object.is_valid.assert_called_once()


@patch("app.downloaders.get_downloader.SWDownload")
@patch("app.downloaders.get_downloader.GalleryDownload")
@patch("app.downloaders.get_downloader.YoutubeDownload")
def test_new_sw_download(
    mock_youtube_download, mock_gallery_download, mock_sw_download
):
    # GIVEN
    mock_sw_object = MagicMock(is_valid=MagicMock(return_value=True), id=1)
    mock_youtube_object = MagicMock(is_valid=MagicMock(return_value=False), id=1)
    mock_gallery_object = MagicMock(is_valid=MagicMock(return_value=False), id=1)

    mock_sw_download.return_value = mock_sw_object
    mock_youtube_download.return_value = mock_youtube_object
    mock_gallery_download.return_value = mock_gallery_object

    # WHEN
    resp = client.post(
        "api/downloads",
        data=json.dumps({"url": "https://youtube.com/blah"}),
        content_type="application/json",
    )

    # THEN
    assert resp.status == "201 CREATED", resp.get_json()
    assert resp.mimetype == "application/json"

    mock_sw_download.assert_called_once()
    mock_youtube_download.assert_not_called()
    mock_gallery_download.assert_not_called()

    mock_sw_object.is_valid.assert_called_once()
    mock_youtube_object.is_valid.assert_not_called()
    mock_gallery_object.is_valid.assert_not_called()


@patch("app.downloaders.get_downloader.SWDownload")
@patch("app.downloaders.get_downloader.GalleryDownload")
@patch("app.downloaders.get_downloader.YoutubeDownload")
def test_invalid_download(
    mock_youtube_download, mock_gallery_download, mock_sw_download
):
    # GIVEN
    mock_sw_object = MagicMock(is_valid=MagicMock(return_value=False), id=1)
    mock_youtube_object = MagicMock(is_valid=MagicMock(return_value=False), id=1)
    mock_gallery_object = MagicMock(is_valid=MagicMock(return_value=False), id=1)

    mock_sw_download.return_value = mock_sw_object
    mock_youtube_download.return_value = mock_youtube_object
    mock_gallery_download.return_value = mock_gallery_object

    # WHEN
    resp = client.post(
        "api/downloads",
        data=json.dumps({"url": "https://youtube.com/blah"}),
        content_type="application/json",
    )

    # THEN
    assert resp.status == "400 BAD REQUEST", resp.get_json()
    assert resp.mimetype == "application/json"

    mock_sw_download.assert_called_once()
    mock_youtube_download.assert_called_once()
    mock_gallery_download.assert_called_once()

    mock_sw_object.is_valid.assert_called_once()
    mock_youtube_object.is_valid.assert_called_once()
    mock_gallery_object.is_valid.assert_called_once()
