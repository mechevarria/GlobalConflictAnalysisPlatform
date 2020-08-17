FROM node:12

WORKDIR /usr/src/app

COPY .npmrc ./

COPY package*.json ./

RUN npm install

COPY .eslintrc ./

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]