# Step 1: Base image
FROM node:22-alpine

# Step 2: App directory
WORKDIR /app

# Step 3: Copy package files
COPY package*.json ./

COPY prisma ./prisma

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy app files
COPY . .

# Step 6: Build app
RUN npm run build

# Step 7: Start app
CMD ["npm", "run", "start:prod"]