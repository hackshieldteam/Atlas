FROM node:12-alpine

RUN mkdir -p /usr/src/app

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Bundle app source
COPY ./dist .
COPY localhost.key .
COPY localhost.cert .

RUN apk --no-cache add --virtual builds-deps build-base python

RUN npm install
# If you are building your code for production
#RUN npm ci --only=production

ENV NODE_PORT=5000

EXPOSE 5000

#CMD ["npm", "run", "deploy"]
#RUN ls -l
#docker run -p 80:80 openapiosp/testxpl:version
CMD ["node", "server.js"]
