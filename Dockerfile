# Build VUE project
FROM node:12.18.1 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Build server
FROM nginx:1.19.0 AS prod-stage
COPY --from=build /app/dist/ /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]