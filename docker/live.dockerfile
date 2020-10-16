FROM node:12.19.0-alpine3.11

WORKDIR /usr/src/app

# Install some system tools that make debugging & operations easier.
RUN apk --no-cache add less vim git

# Install node package dependencies.
COPY package.json yarn.lock ./
RUN yarn install

# By default, do nothing, waiting for someone to exec into the container to run.
CMD tail -f /dev/null
