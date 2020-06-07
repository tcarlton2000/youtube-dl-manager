import logging
import subprocess
import threading

from time import sleep

from app.file import File
from app.settings import Settings


class Download(threading.Thread):
    logger = logging.getLogger("Download")

    def __init__(self, url, directory=None):
        self.url = url
        self.directory = directory
        self.id = None
        self.logger.info(f"New Download: {url}")
        threading.Thread.__init__(self)

    def run(self):
        cmd = f"youtube-dl --no-mtime {self.url}"
        cwd = self.directory or Settings.get_setting("downloadDirectory")
        p = subprocess.Popen(
            cmd.split(),
            cwd=cwd,
            universal_newlines=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )

        new_file = File.new_file(self.url, cwd)
        self.id = new_file.id

        while True:
            output = p.stdout.readline()
            if output == "" and p.poll() is not None:
                if p.poll() == 0:
                    new_file.complete()
                else:
                    new_file.error()
                break
            if output:
                new_file.add_to_log(output)
            sleep(0.1)  # Sleep between log entries to prevent DB locks
