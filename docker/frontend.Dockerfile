FROM node:18-alpine

WORKDIR /app

# Install dependencies only when needed
# Skip if node_modules exists in volume
COPY package.json ./
RUN npm install --legacy-peer-deps

# Copy application code
COPY . .

# Expose port
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"] 