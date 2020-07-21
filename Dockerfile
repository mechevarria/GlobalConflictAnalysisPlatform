FROM node:12

WORKDIR /usr/src/app

COPY .npmrc ./

COPY .eslintrc ./

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]