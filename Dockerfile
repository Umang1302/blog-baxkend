FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY dist ./dist

CMD ["node", "dist/main.js"]