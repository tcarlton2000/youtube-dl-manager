FROM python:3.6-alpine

RUN apk update && apk add ffmpeg && rm -rf /var/cache/apk/*

COPY . /app
WORKDIR /app

RUN pip install pipenv && pipenv install

ENV PYTHONPATH /app
CMD ["pipenv", "run", "python", "app/youtube.py"]
