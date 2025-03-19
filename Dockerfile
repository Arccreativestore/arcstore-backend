
# Use the official Node.js image
FROM node:20.17.0


# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and yarn.lock
COPY package*.json yarn.lock ./

# Clear Yarn cache before installing dependencies
RUN yarn cache clean

# Install dependencies with a fresh cache
RUN yarn install --frozen-lockfile --force

# Copy the rest of the application
COPY . .

# Build the application with increased memory (8GB Heap)
RUN NODE_OPTIONS="--max-old-space-size=8192" yarn build

# Use a lightweight Node.js 18.12.0 slim image for the final container
FROM node:20.17.0 AS production

WORKDIR /usr/src/app

# Copy only necessary files from the build stage
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY package.json ./

# Set environment variables
ENV NODE_ENV=production

# Expose the application port
EXPOSE 3000

# Start the application using a script
CMD ["node", "dist/app.js"]