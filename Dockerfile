FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install --no-save express socket.io cors
CMD ["node", "server.js"]


