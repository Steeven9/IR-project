FROM node:latest

RUN mkdir -p /usr/IR-project
COPY . /usr/IR-project
EXPOSE 3000

# Run UI webserver on localhost:3000
WORKDIR /usr/IR-project/
RUN yarn install
CMD ["yarn", "start"]
