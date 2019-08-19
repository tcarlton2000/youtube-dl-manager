FROM mhart/alpine-node:10

# System Basics
RUN apk add --update python3
RUN python3 -m pip install --upgrade pip
RUN apk add ffmpeg && rm -rf /var/cache/apk/*
RUN pip install pipenv

# Python dependencies
COPY Pipfile* /app/
WORKDIR /app
RUN pipenv install

# Node dependencies
WORKDIR .
COPY webpack.config.js /app
COPY .babelrc /app
COPY *.json /app/
RUN npm install

# Setup and start app
WORKDIR .
COPY ./app /app/app
WORKDIR /app
RUN npm run dev

ENV PYTHONPATH /app
CMD ["pipenv", "run", "python", "app/youtube.py"]
