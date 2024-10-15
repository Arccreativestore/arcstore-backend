# Use a Node.js base image
FROM node:18.12.0

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies using Yarn
RUN yarn install --production

# Copy the rest of the application code
COPY . .

# Build the project (if you're using TypeScript, ensure the build script is correctly set up in package.json)
RUN yarn build

# Expose the port
EXPOSE 3000

# Start the app
CMD ["yarn", "start"]
