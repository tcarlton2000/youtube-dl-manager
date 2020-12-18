import logging
import threading

from app.settings import Settings


class BaseDownloader(threading.Thread):
    logger = logging.getLogger("BaseDownloader")

    def __init__(self, url, directory=None):
        self.url = url
        self.directory = directory
        self.id = None
        self.file = None
        self.logger.info(f"New Download: {url}")
        threading.Thread.__init__(self)

    def _get_download_directory(self):
        return self.directory or Settings.get_setting("downloadDirectory")
