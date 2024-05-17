# Use a Node.js base image with a specified version
FROM node:19.5.0-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the entire project to the working directory
COPY . .

# Build the project
RUN npm run build

# Expose the port on which the server will run
EXPOSE 8080

ARG API_URI
ARG MONGO_URI
ARG MONGO_MAIN_DB
ARG ASSETS_URI
ARG DEFAULT_COUNTRY_CODE

ENV API_URI=$API_URI
ENV MONGO_URI=$MONGO_URI
ENV MONGO_MAIN_DB=$MONGO_MAIN_DB
ENV ASSETS_URI=$ASSETS_URI
ENV DEFAULT_COUNTRY_CODE=$DEFAULT_COUNTRY_CODE

ENV NODE_ENV production
ENV PORT 8080

# Command to run the server
CMD ["npm", "start"]
