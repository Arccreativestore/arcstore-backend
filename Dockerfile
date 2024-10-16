# Use a Node.js base image (LTS version 18.12.0)
FROM node:18.12.0

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy only the package files first to take advantage of Docker layer caching
COPY package.json yarn.lock ./

# Install production dependencies using Yarn (ignores devDependencies)
RUN yarn install --production

# Copy the rest of the application code into the container
COPY . .

# Build the project (if using TypeScript or other pre-build steps)
# Make sure `yarn build` is defined in your package.json
RUN yarn build

# Expose the port that the application will run on
EXPOSE 3000

# Set the command to start the app
CMD ["yarn", "start"]
