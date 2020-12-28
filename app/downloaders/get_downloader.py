from app.downloaders.gallery_download import GalleryDownload
from app.downloaders.sw_download import SWDownload
from app.downloaders.youtube_download import YoutubeDownload


def get_downloader(url, directory=None):
    for download_class in [SWDownload, YoutubeDownload, GalleryDownload]:
        downloader = download_class(url, directory=directory)
        if downloader.is_valid():
            return downloader

    return None
