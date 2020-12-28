docker build . -t media-dl-manager
docker run -v "${DOWNLOADS}":/downloads -v "${CONFIG}":/config -p 16000:5000 --name media-dl-manager_staging -d media-dl-manager
