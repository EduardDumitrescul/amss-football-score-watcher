# Use the Node image for the development server
FROM node:22-alpine
WORKDIR /app

# Copy package files and install dependencies
# This is cached, so it only re-runs if package.json changes
COPY package.json package-lock.json ./
RUN npm install

COPY . . 

# Expose the Vite port (default is 5173)
EXPOSE 5173

# Run the dev server
# The "-- --host" is CRUCIAL to expose the server
# outside the container's private network.
CMD ["npm", "run", "dev", "--", "--host"]