FROM node:22.21.1

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 3000

CMD sh -c "npx prisma migrate deploy && npx prisma db seed && npm run dev"