# Use Nginx to serve the static website
FROM nginx:1.27-alpine

# Copy entrypoint hook FIRST to generate runtime config from env vars
COPY docker-entrypoint.d/*.sh /docker-entrypoint.d/

# Ensure entrypoint scripts are executable so nginx entrypoint runs them
RUN chmod +x /docker-entrypoint.d/*.sh

# Copy site into the default Nginx web root
COPY . /usr/share/nginx/html

# Ensure static content is world-readable (avoid 403 on assets due to restrictive perms)
RUN find /usr/share/nginx/html -type d -exec chmod 755 {} \; \
	&& find /usr/share/nginx/html -type f -exec chmod 644 {} \;

# Expose HTTP
EXPOSE 80

# Default Nginx entrypoint/cmd handles serving
