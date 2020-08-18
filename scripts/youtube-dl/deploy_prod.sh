docker build . -f Dockerfile.youtube -t youtube-dl-manager
docker run -v "${DOWNLOADS}":/downloads -v "${CONFIG}":/config -p 5000:5000 --name youtube-dl-manager -d youtube-dl-manager
