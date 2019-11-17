FROM node:10.16.3-alpine

RUN apk update && \
	apk upgrade && \
	apk add ca-certificates && \
	apk add python && \
	apk add make && \
	apk add g++ && \
	apk add --update bash

ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /app && cp -a /tmp/node_modules /app/

WORKDIR /app
ADD . /app

EXPOSE 3022

RUN npm run build

CMD ["npm", "run", "serve"]