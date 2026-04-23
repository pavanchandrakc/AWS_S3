# Use a slim version of Node.js
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package files first to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend source code
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose the port the app runs on (matching your Express config)
EXPOSE 5000

# Command to run the application
CMD ["npm", "start"]
