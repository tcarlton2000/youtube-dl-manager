import logging
import os
import re
import subprocess

from time import sleep

from app.downloaders.base_downloader import BaseDownloader
from app.file import File
from app.type import Type


class YoutubeDownload(BaseDownloader):
    logger = logging.getLogger("YoutubeDownload")

    def __init__(self, url, directory=None):
        super().__init__(url, directory=directory)

    def is_valid(self):
        ret_val = os.system(f"youtube-dl --skip-download {self.url}")
        return ret_val == 0

    def run(self):
        cmd = f"youtube-dl --no-mtime {self.url}"
        cwd = self._get_download_directory()
        p = subprocess.Popen(
            cmd.split(),
            cwd=cwd,
            universal_newlines=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )

        self.file = File.new_file(self.url, Type.TYPE_YOUTUBE_ID, cwd)
        self.id = self.file.id

        while True:
            output = p.stdout.readline()
            if output == "" and p.poll() is not None:
                if p.poll() == 0:
                    self.file.complete()
                else:
                    self.file.error()
                break
            if output:
                updates = {}
                updates.update(self.parse_name(output, self.id))
                updates.update(self.parse_stats(output))
                self.file.update_db(updates)
            sleep(0.1)  # Sleep between log entries to prevent DB locks

    @classmethod
    def parse_name(cls, line, _id):
        starting_name_re = re.search(r"Destination: (.*)", line)
        if starting_name_re:
            name = starting_name_re.group(1)
            cls.logger.info(f"Found name for ID({_id}): {name}")
            return {"name": name}

        completed_name_re = re.search(
            r"\[download\] (.*) has already been downloaded and merged", line
        )
        if completed_name_re:
            name = completed_name_re.group(1)
            cls.logger.info(f"Found name for ID({_id}): {name}")
            return {"name": name}

        return {}

    @classmethod
    def parse_stats(cls, line):
        status_re = re.search(
            r"(\d+\.\d+)%\s+of\s+(~?\d+\.\d+\w+)\s"
            r"+at\s+(\d+\.\d+.+)\s+ETA\s+((\d+:)?\d+:\d+)",
            line,
        )
        if status_re:
            return {
                "percent": float(status_re.group(1)),
                "size": status_re.group(2),
                "speed": status_re.group(3),
                "time_remaining": status_re.group(4),
            }

        return {}
