FROM node:18-alpine
WORKDIR /app
COPY . .
CMD ["sh", "-c", "npm install --no-save express socket.io cors && node server.js"]
