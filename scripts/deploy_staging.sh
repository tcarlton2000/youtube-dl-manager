docker build . -t media-dl-manager
docker run -v "${DOWNLOADS}":/downloads -v "${CONFIG}":/config --env SW_DOWNLOAD_HOST=${SW_DOWNLOAD_HOST} -p 16000:5000 --name media-dl-manager_staging -d media-dl-manager
