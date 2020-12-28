docker build . -t media-dl-manager
docker run -v "${DOWNLOADS}":/downloads -v "${CONFIG}":/config -p 5000:5000 --name media-dl-manager -d media-dl-manager
