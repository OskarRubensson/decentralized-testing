FROM node:14-alpine

USER root

RUN apk update && apk add nodejs && apk add chromium && apk add chromium-chromedriver

RUN mkdir data && mkdir data/decentralized-testing
ADD ./ /data/decentralized-testing
WORKDIR /data/decentralized-testing

# optionally if you want to run npm global bin without specifying path
ENV PATH=$PATH:/home/root/.npm-global/bin

RUN apk --no-cache add --virtual python
RUN npm config set python /usr/bin/python
RUN npm i -g npm
RUN npm install
# RUN npm install -g hyper-gateway

ENTRYPOINT npm run client

EXPOSE 4444:4444
EXPOSE 5900:5900
EXPOSE 80:80