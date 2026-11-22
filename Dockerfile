FROM node:18-alpine
WORKDIR /app
COPY . .
RUN rm -rf node_modules package-lock.json && npm install express socket.io cors multer uuid dotenv ws body-parser cookie-parser
CMD ["node", "server.js"]
