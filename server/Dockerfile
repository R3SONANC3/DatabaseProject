# Use official Node.js image (Alpine version for a smaller image)
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy only package files first to leverage Docker cache for dependencies
COPY package*.json ./

# Install dependencies (including production and development dependencies)
RUN npm install --production=false

# Copy the rest of the application code
COPY . .

# Expose the application port
EXPOSE 8000

# Use a non-root user for better security (optional, but recommended)
RUN adduser -D appuser
USER appuser

# Command to run the app in development mode
CMD ["npm", "run", "dev"]
