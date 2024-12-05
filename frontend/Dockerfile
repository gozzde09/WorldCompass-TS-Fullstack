#Dockerfile Multi-Stage
# Build frontend with Node.js
FROM node AS build
WORKDIR /app
COPY . .
RUN npm install --verbose
RUN npm run build

# use frontend and conf. proxy with NGINX
FROM nginx:latest
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80

#cypress
FROM cypress/included:12.8.1
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npx", "cypress", "run"]
