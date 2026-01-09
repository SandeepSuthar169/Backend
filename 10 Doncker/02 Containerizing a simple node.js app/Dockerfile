FROM node:22-alpine
# node.js offical image runtime

WORKDIR /app
# set the working derectory

COPY package*.json ./
# copy all pakage.json file in the working directory

RUN npm install 
# install dedendencies

COPY . . 

ENV PORT=8008

CMD ["node", "index.js", ""]