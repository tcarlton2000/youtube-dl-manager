import logging
import subprocess

from app.downloaders.base_downloader import BaseDownloader
from app.file import File


class GalleryDownload(BaseDownloader):
    logger = logging.getLogger("GalleryDownload")

    def __init__(self, url, directory=None):
        super().__init__(url, directory=directory)

    def run(self):
        cmd = f"gallery-dl {self.url} -d ."
        cwd = self._get_download_directory()
        p = subprocess.Popen(
            cmd.split(),
            cwd=cwd,
            universal_newlines=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )

        self.file = File.new_file(self.url, cwd, name=self.url)
        self.id = self.file.id

        while True:
            output = p.stdout.readline()
            if output == "" and p.poll() is not None:
                if p.poll() == 0:
                    self.file.complete()
                else:
                    self.file.error()
                break
