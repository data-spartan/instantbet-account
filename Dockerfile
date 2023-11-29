# Base image
FROM node:18.18.0-alpine As development

ENV NODE_ENV development
# Create app directory
WORKDIR /usr/src/app

#in case error: EACCES: permission denied mkdir
RUN chown -R node:node /usr/src/app

COPY --chown=node:node package*.json ./

# Install app dependencies
RUN npm ci && npm cache clean --force

# Bundle app source
COPY . .

# Creates a "dist" folder with the production build
RUN npm run build

USER node
# Start the server using the production build
CMD [ "node", "dist/main.js" ]
