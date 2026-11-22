FROM node:18-alpine
WORKDIR /app
COPY . .
RUN rm -rf node_modules package-lock.json && npm install express socket.io cors
CMD ["node", "server.js"]



