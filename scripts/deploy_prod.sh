docker build . -t media-dl-manager
docker run -v "${DOWNLOADS}":/downloads -v "${CONFIG}":/config --env SW_DOWNLOAD_HOST=${SW_DOWNLOAD_HOST} -p 5000:5000 --name media-dl-manager -d media-dl-manager
