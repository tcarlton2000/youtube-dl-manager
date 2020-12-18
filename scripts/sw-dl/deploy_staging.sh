docker build . -f Dockerfile.sw -t sw-dl-manager
docker run -v "${DOWNLOADS}":/downloads -v "${CONFIG}":/config -p 17000:5075 --name sw-dl-manager_staging -d sw-dl-manager
