FROM node:24-alpine

WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) to leverage Docker's layer caching
COPY package*.json ./

# Copy the rest of the application code
COPY . .

# Install dependencies
RUN npm install && npx prisma generate && npm run build

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application when the container starts
CMD ["npm", "start"]