FROM mhart/alpine-node:10

RUN apk add --update python3
RUN python3 -m pip install --upgrade pip
RUN apk add ffmpeg && rm -rf /var/cache/apk/*

COPY . /app
WORKDIR /app

RUN pip install pipenv && pipenv install
RUN npm install && npm run dev

ENV PYTHONPATH /app
CMD ["pipenv", "run", "python", "app/youtube.py"]
