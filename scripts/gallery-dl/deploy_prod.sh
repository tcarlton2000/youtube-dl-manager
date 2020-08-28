docker build . -f Dockerfile.gallery -t gallery-dl-manager
docker run -v "${DOWNLOADS}":/downloads -v "${CONFIG}":/config -p 5050:5050 --name gallery-dl-manager -d gallery-dl-manager
