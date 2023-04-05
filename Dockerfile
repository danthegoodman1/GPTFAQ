FROM node:18-alpine as build

WORKDIR /app

COPY . .

RUN npm i

RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=build /app/build /app/
COPY --from=build /app/package.json /app
COPY --from=build /app/package-lock.json /app

RUN npm ci --omit=dev

ENTRYPOINT ["npm", "start:docker"]
