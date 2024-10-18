# Use the official Node.js image
FROM node:18.12.0

# Create and change to the app directory
WORKDIR /usr/src/app


# Copy package.json and yarn.lock
COPY package.json  ./

# Install dependencies using Yarn
RUN yarn install

# Copy the rest of the application code
COPY . .

# Install TypeScript globally (if needed)
# RUN yarn global add typescript

# Compile TypeScript to JavaScript
RUN yarn build

# Expose the ports the app runs on
EXPOSE 3000

# Command to run the app
CMD ["node", "dist/app.js"]
