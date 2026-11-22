FROM node:18-alpine
WORKDIR /app
RUN npm install -g express socket.io cors
ENV NODE_PATH=/usr/local/lib/node_modules
COPY . .
CMD ["node", "server.js"]



