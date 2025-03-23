FROM node AS build

ARG BACKEND_LOCATION
ENV VITE_FLASK_BACKEND_LOCATION=${BACKEND_LOCATION:-/amos/api}

ARG COMPTOX_PAGE_URL=https://comptox.epa.gov/dashboard/dsstoxdb/results?search=
ENV VITE_COMPTOX_PAGE_URL=$COMPTOX_PAGE_URL

ARG IMAGE_BY_DTXSID_API=https://comptox.epa.gov/dashboard-api/ccdapp1/chemical-files/image/by-dtxsid/
ENV VITE_IMAGE_BY_DTXSID_API=$IMAGE_BY_DTXSID_API

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html

COPY --from=build /app/dist /usr/share/nginx/html

COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
