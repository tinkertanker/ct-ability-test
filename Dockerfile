FROM node:20-alpine

WORKDIR /app

COPY backend/package.json ./backend/package.json
RUN cd backend && npm install

COPY backend ./backend
COPY web ./web

EXPOSE 3000

CMD ["node", "backend/src/server.js"]
