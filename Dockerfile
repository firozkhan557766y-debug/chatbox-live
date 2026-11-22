FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install express socket.io cors
CMD ["node", "server.js"]

