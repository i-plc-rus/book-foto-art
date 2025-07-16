# 1. Stage: build Angular SSR (browser + server)
FROM node:20 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build:ssr
# RUN npm run serve:ssr:bookfotoart


# 2. Stage: run Angular Universal server
FROM node:20 AS runtime

WORKDIR /app

COPY --from=build /app/dist/bookfotoart /app/dist/bookfotoart
COPY --from=build /app/dist/bookfotoart-server /app/dist/bookfotoart-server
COPY --from=build /app/package*.json ./

RUN npm install --omit=dev

EXPOSE 4000

CMD ["node", "dist/bookfotoart-server/main.js"]
