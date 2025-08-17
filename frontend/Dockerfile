FROM node:20-alpine as build
WORKDIR /app
COPY package.json package-lock.json* /app/
RUN npm ci
COPY . /app
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/dist /app/dist
COPY --from=build /app/package.json /app/
# use vite preview to serve static build
RUN npm i -g vite@5.4.2
EXPOSE 5173
CMD ["vite", "preview", "--host", "0.0.0.0", "--port", "5173", "--strictPort"]