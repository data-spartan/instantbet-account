# Base image
FROM node:18.18.0-alpine

# ARG ENV
# ENV NODE_ENV ${ENV}
# Create app directory
WORKDIR /usr/src
#in case error: EACCES: permission denied mkdir
RUN mkdir -p logs && chown -R node:node /usr/src/

COPY --chown=node:node package*.json ./

# Install app dependencies
RUN npm ci && npm cache clean --force

# Bundle app source
COPY --chown=node:node . .
# RUN chown -R node /usr/src/app
USER node
# Creates a "dist" folder with the production build
RUN npm run build notifications
# Start the server using the production build
CMD if [ "$NODE_ENV" = "production" ]; \
then npm run start notifications; \
else npm run start:dev notifications; \
fi
# CMD [ "node", "dist/apps/notifications/main.js" ]
