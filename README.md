# Youtube Download Manager
This application is a API (and soon to be UI) wrapper around the youtube-dl app.

## Installation
Coming Soon

## Setup Development Environment
1. Build docker image
    ```
    docker build . -t youtube-dl-manager
    ```
2. Start docker image
    ```
    docker run -v <path to download folder>:/downloads youtube-dl-manager
    ```
