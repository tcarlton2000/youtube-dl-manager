import os
import pytest

from unittest.mock import call, MagicMock, patch
from app.downloaders.sw_download import SWDownload
import test.utils  # noqa: F401


def mocked_requests_get_func(url, **kwargs):
    if url == "mock.album.url":
        test_file_dir = os.path.dirname(__file__)
        mock_html = open(f"{test_file_dir}/resources/sw.html", "r")
        return MagicMock(text=mock_html.read())
    else:
        return MagicMock(content="content")

    return url


@patch("app.downloaders.sw_download.requests.get", side_effect=mocked_requests_get_func)
@patch("app.downloaders.sw_download.os.chdir")
@patch("app.downloaders.sw_download.os.mkdir")
@patch("app.downloaders.sw_download.open")
def test_sw_download(mocked_open, mocked_mkdir, mocked_chdir, mocked_requests_get):
    # GIVEN
    url = "mock.album.url"
    download_dir = "/download/dir"

    # WHEN
    sw_download = SWDownload(url, directory=download_dir)
    sw_download.run()

    # THEN
    full_download_path = f"{download_dir}/Mock Title"
    mocked_mkdir.assert_called_with(full_download_path)
    mocked_chdir.assert_called_with(full_download_path)
    mocked_open.assert_has_calls(
        [
            call("test1.img", "wb"),
            call().write("content"),
            call("test2.img", "wb"),
            call().write("content"),
            call("test3.img", "wb"),
            call().write("content"),
        ]
    )


@pytest.mark.parametrize(
    "url,expected_is_valid",
    [
        ("https://www.swdownload.com/video/1234", True),
        ("https://www.youtube.com/video/343", False),
    ],
)
def test_is_valid(url, expected_is_valid):
    # GIVEN
    os.environ["SW_DOWNLOAD_HOST"] = "www.swdownload.com"

    # WHEN
    download = SWDownload(url)
    is_valid = download.is_valid()

    # THEN
    assert is_valid == expected_is_valid
