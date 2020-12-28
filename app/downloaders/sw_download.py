import logging
import requests
import os

from bs4 import BeautifulSoup
from urllib.parse import urlparse

from app.downloaders.base_downloader import BaseDownloader
from app.file import File
from app.type import Type


class SWDownload(BaseDownloader):
    logger = logging.getLogger("SWDownload")

    def __init__(self, url, directory=None):
        super().__init__(url, directory=directory)
        self.expected_host = os.getenv("SW_DOWNLOAD_HOST")

    def is_valid(self):
        parsed_url = urlparse(self.url)
        return parsed_url.hostname == self.expected_host

    def run(self):
        try:
            html = requests.get(self.url)
            self.soup = BeautifulSoup(html.text, "html.parser")
            cwd = self._get_download_directory()
            self.file = File.new_file(self.url, Type.TYPE_SW_ID, cwd)
            self.id = self.file.id
            self.sw_download(cwd)
            self.file.complete()
        except Exception as err:
            self.file.error()
            raise err

    def find_all_images(self):
        gallery = self.soup.find(id="product-photos")
        urls = [f"https:{link.get('href')}" for link in gallery.find_all("a")]
        return urls

    def create_album_directory(self, base_dir):
        gallery_name = self.soup.title.string.strip()
        self.file.update_db({"name": gallery_name})
        path = os.path.join(base_dir, gallery_name)
        os.mkdir(path)
        return path

    def download_all_images(self, urls, download_dir):
        os.chdir(download_dir)
        total_images = len(urls)
        completed_count = 0
        for url in urls:
            r = requests.get(url, allow_redirects=True)
            filename = self.get_filename(url)
            open(filename, "wb").write(r.content)
            completed_count += 1
            percentage_complete = (completed_count / total_images) * 100
            self.file.update_db({"percent": percentage_complete})

    def get_filename(self, url):
        url_without_params = url.split("?")[0]
        return url_without_params.split("/")[-1]

    def sw_download(self, base_dir):
        image_urls = self.find_all_images()
        download_dir = self.create_album_directory(base_dir)
        self.download_all_images(image_urls, download_dir)
