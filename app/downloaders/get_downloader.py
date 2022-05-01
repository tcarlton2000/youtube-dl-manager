from app.downloaders.gallery_download import GalleryDownload
from app.downloaders.sw_download import SWDownload
from app.downloaders.youtube_download import YoutubeDownload


def get_downloader(url, directory=None, downloader="auto"):
    DOWNLOADER_MAP = {
        "youtube": YoutubeDownload,
        "gallery": GalleryDownload,
        "sw": SWDownload,
    }

    lower_downloader = downloader.lower() if downloader is not None else None
    if lower_downloader in DOWNLOADER_MAP:
        return DOWNLOADER_MAP[lower_downloader](url, directory=directory)

    if lower_downloader is not None and lower_downloader != "auto":
        return None

    for download_class in [SWDownload, YoutubeDownload, GalleryDownload]:
        downloader = download_class(url, directory=directory)
        if downloader.is_valid():
            return downloader

    return None
