# Use a lightweight Node.js image for building
FROM node:20-alpine as builder

# Set the working directory
WORKDIR /app

# Copy necessary files to install dependencies
COPY package*.json ./

# Install Angular CLI globally
RUN npm install -g @angular/cli

# Install project dependencies
RUN npm install

# Copy the entire application
COPY . .

# Build the application
RUN ng build --aot

# Use a lightweight Nginx image to serve the application
FROM nginx:alpine

# Copy the production directory from the previous stage to Nginx's default directory
COPY --from=builder /app/dist/ /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# CMD command starts Nginx when a container based on this image is launched
CMD ["nginx", "-g", "daemon off;"]
