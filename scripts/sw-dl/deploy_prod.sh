docker build . -f Dockerfile.sw -t sw-dl-manager
docker run -v "${DOWNLOADS}":/downloads -v "${CONFIG}":/config -p 5075:5075 --name sw-dl-manager -d sw-dl-manager
