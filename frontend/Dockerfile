FROM node:14.11.0-alpine3.12 as builder
WORKDIR /usr/app

COPY package.json package.json
COPY yarn.lock yarn.lock
RUN yarn

COPY . .

RUN mv src/credentials.prod.js src/credentials.js
RUN mv src/env.prod.js src/env.js

RUN yarn build
RUN yarn style

FROM node:14.11.0-alpine3.12 as runner
EXPOSE 80
ENV PORT=80
CMD ["node", "__sapper__/build"]
WORKDIR /usr/app

COPY --from=builder /usr/app/package.json package.json
COPY --from=builder /usr/app/node_modules /usr/app/node_modules

COPY --from=builder /usr/app/__sapper__ __sapper__
COPY --from=builder /usr/app/static static