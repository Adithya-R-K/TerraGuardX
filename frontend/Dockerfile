FROM node:20-slim
WORKDIR /web
COPY package.json ./
RUN npm install
COPY . .
CMD ["npm","run","dev","--","--host","0.0.0.0","--port","5173"]
