# Use the official nginx image as the base image
FROM nginx:alpine

# Copy the static website files to the nginx html directory
COPY . /usr/share/nginx/html

# Expose port 80 for the web server
EXPOSE 80

# The default command for nginx is to start the server, so no need to specify CMD