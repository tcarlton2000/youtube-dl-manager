docker build . -f Dockerfile.gallery -t gallery-dl-manager
docker run -v "${DOWNLOADS}":/downloads -v "${CONFIG}":/config -p 16050:5050 --name gallery-dl-manager_staging -d gallery-dl-manager
