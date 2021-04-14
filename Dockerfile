FROM node:15

WORKDIR /usr/app

COPY package*.json ./

RUN npm install

COPY . . 

EXPOSE 3000

CMD ["node", "server/index.js"]