# Base image
FROM node:18.18.0-alpine As dev

WORKDIR /usr/src

#in case error: EACCES: permission denied mkdir
RUN chown -R node:node /usr/src/ && mkdir -p usr/src/logs && chown -R node:node usr/src/logs

COPY --chown=node:node package*.json ./

# Install app dependencies
RUN npm ci --only=dev && npm cache clean --force

# Bundle app source
COPY --chown=node:node . .
# RUN chown -R node /usr/src/app

# Creates a "dist" folder with the dev build
RUN npm run build account

USER node

CMD if [ "$NODE_ENV" != "production" ]; \
then npm run start:dev account; \
fi

FROM node:18.18.0-alpine As production

WORKDIR /usr/src

COPY --chown=node:node package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY --chown=node:node --from=dev /usr/src/dist ./dist

CMD ["node", "dist/apps/account/main"]
