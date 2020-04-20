from os import listdir
from os.path import isdir, join


def get_directories_in_path(path):
    return {"directories": [d for d in listdir(path) if isdir(join(path, d))]}
