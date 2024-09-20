
FROM node:18.18.0

# Create and change to the app directory
WORKDIR /usr/src/app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies using Yarn
RUN yarn install

# Copy the rest of the application code
COPY . .


# Compile TypeScript to JavaScript (if applicable)
RUN yarn build


# Expose the port specified in the environment variable
EXPOSE 3000

# Command to run the app
CMD ["yarn", "start"]
