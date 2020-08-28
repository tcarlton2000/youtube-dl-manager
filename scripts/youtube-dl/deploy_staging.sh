docker build . -f Dockerfile.youtube -t youtube-dl-manager
docker run -v "${DOWNLOADS}":/downloads -v "${CONFIG}":/config -p 16000:5000 --name youtube-dl-manager_staging -d youtube-dl-manager
