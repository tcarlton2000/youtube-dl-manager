FROM python:3.6-alpine

RUN apk update && apk add ffmpeg && rm -rf /var/cache/apk/*

COPY . /app
WORKDIR /app

RUN pip install -r requirements.txt

ENTRYPOINT [ "python" ]
CMD ["app/youtube.py"]