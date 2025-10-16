FROM node:22.20-alpine3.21

EXPOSE 3001

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "npm", "start" ]
