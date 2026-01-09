FROM node:22-alpine

WORKDIR /app

COPY package.json ./ 
# currnent derectory
COPY package-lock.json ./

RUN npm install

COPY . .  
# first dot is current folder in my folder derectory
# secound dot is  my container working derectory 

EXPOSE 5173

CMD ["npm", "run", "dev"]
