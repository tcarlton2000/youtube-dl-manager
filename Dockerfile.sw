FROM mhart/alpine-node:10

# Environment Variables
ENV DOWNLOADS=/downloads
ENV CONFIG=/config
ENV DOWNLOAD_TYPE=sw

# System Basics
RUN apk add --no-cache make gcc g++ python3 python3-dev
RUN python3 -m pip install --upgrade pip
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
RUN npm run build:sw

ENV PYTHONPATH /app
CMD ["pipenv", "run", "python", "app/api.py"]
