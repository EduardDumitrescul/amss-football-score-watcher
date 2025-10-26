# Stage 1: Build the React application
# Use a Node.js base image
FROM node:22-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the production-ready static files
RUN npm run build

# Stage 2: Serve the application with Nginx
# Use a lightweight Nginx image
FROM nginx:1.23-alpine

# Copy the static files from the 'build' stage to Nginx's web root
# 'dist' is the default build folder for Vite
COPY --from=build /app/dist /usr/share/nginx/html

# Copy our custom Nginx configuration (we will create this next)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 (Nginx's default port)
EXPOSE 80