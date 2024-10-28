# Use the official Node.js image as a base
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the TypeScript files if necessary (comment this out if not using TypeScript)
# RUN npm run build

# Expose the port on which your app will run
EXPOSE 8000

# Command to start the application (change as needed)
CMD ["npm", "start"]
