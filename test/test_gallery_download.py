import pytest
from unittest.mock import patch

from app.downloaders.gallery_download import GalleryDownload


@patch("app.downloaders.gallery_download.os.system")
@pytest.mark.parametrize(
    "os_system_return,expected_is_valid", [(0, True), (256, False)]
)
def test_is_valid(mock_os_system, os_system_return, expected_is_valid):
    # GIVEN
    mock_os_system.return_value = os_system_return
    url = "https://www.gallery.com/watch/1234"

    # WHEN
    download = GalleryDownload(url)
    is_valid = download.is_valid()

    # THEN
    mock_os_system.assert_called_with(f"gallery-dl --no-download {url}")
    assert is_valid == expected_is_valid
