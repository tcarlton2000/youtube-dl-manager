# Youtube Download Manager
This application is a API and UI wrapper around the youtube-dl app.

## Installation
Coming Soon

## Setup Development Environment

### Youtube
1. Build docker image
    ```
    docker build . -f Dockerfile.youtube -t youtube-dl-manager
    ```
2. Start docker image
    ```
    docker run -v <path to download folder>:/downloads -v <path to config dir>:/config youtube-dl-manager
    ```

### Gallery
1. Build docker image
    ```
    docker build . -f Dockerfile.gallery -t gallery-dl-manager
    ```
2. Start docker image
    ```
    docker run -v <path to download folder>:/downloads -v <path to config dir>:/config gallery-dl-manager
    ```
