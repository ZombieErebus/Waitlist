FROM node:10-alpine

# Force UTC times for all of our dates
ENV TZ="Etc/GMT"

RUN apk --no-cache add git openssh

RUN mkdir -p /opt/goon_waitlist
WORKDIR /opt/goon_waitlist
COPY package.json package-lock.json ./
RUN npm install -g npm@7.7.5
RUN npm ci
COPY . .
RUN npm run webpack
RUN npm run build:js
CMD ["node", "index.js"]
