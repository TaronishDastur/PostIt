FROM node:latest

WORKDIR /src/app

COPY package*.json .

# Install any needed packages
RUN npm i

# Bundle app source
COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]