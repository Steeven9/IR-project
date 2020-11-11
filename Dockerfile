FROM node:latest

RUN mkdir -p /usr/IR-project
COPY . /usr/IR-project
EXPOSE 5000

# Run UI webserver on localhost:3000
WORKDIR /usr/IR-project/
RUN yarn install
RUN yarn build
RUN yarn global add serve
CMD ["serve", "-s", "build"]