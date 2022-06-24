FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm ci

# Bundle app source
COPY . .
COPY .env.example .env

RUN npm run build

EXPOSE $PORT

CMD [ "npm", "start" ]
