# Use the official Node.js image as the base
FROM node:20.17.0 AS build

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Build the application with increased memory
RUN NODE_OPTIONS="--max-old-space-size=4096" yarn build

# Use a lightweight Node.js image for the final container
FROM node:20.17.0 AS production

WORKDIR /usr/src/app

# Copy only necessary files from the build stage
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY package.json ./

# Set environment variables
ENV NODE_ENV=production
ENV NODE_OPTIONS=--max-old-space-size=4096

# Expose the application port
EXPOSE 3000

# Start the application using a script
CMD ["node", "dist/app.js"]
