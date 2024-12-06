
FROM node:14 AS backend
COPY . /app
WORKDIR /app
COPY package*.json ./
RUN npm install --verbose
RUN npm run tsc
COPY . .
EXPOSE 3000
ENTRYPOINT ["node", "index.js"]
