# backend/Dockerfile
FROM node:22.20-alpine3.21

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3070

CMD [ "npm", "start" ]
