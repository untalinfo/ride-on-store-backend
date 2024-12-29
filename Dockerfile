
FROM node:20


WORKDIR /usr/src/app


COPY package.json yarn.lock ./


RUN yarn install


COPY . .


RUN yarn global add @nestjs/cli


EXPOSE 3000


CMD ["yarn", "start:dev"]