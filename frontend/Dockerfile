FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 5173

# Using a simple dev server for demonstration; in production, use Nginx
CMD ["npm", "run", "dev", "--", "--host"]
