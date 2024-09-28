
FROM node:18.18.0

# Create and change to the app directory
WORKDIR /usr/src/app

# Copy package.json and yarn.lock
COPY package.json .

# Install dependencies using Yarn
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the TypeScript files
RUN npm run build

# Expose the port specified in the environment variable
EXPOSE 3000

# Command to run the app
CMD ["npm", "start"]
