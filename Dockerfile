FROM node:10.9.0
RUN mkdir /usr/src/app
WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH
COPY package.json /usr/src/app/package.json
RUN npm install --silent
RUN npm install react-scripts@1.1.5 -g --silent
COPY . /usr/src/app
RUN npm run build

EXPOSE 8080
EXPOSE 3000

CMD ["npm", "start"]