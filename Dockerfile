FROM node:18.19-slim AS build

WORKDIR /usr/src/app

COPY package.json yarn.lock tsconfig.json .yarnrc.yml ./
COPY ./.yarn ./.yarn

RUN yarn install

COPY ./src ./src
COPY ./types ./types
COPY ./public ./public
COPY ./config ./config

RUN NODE_ENV=production yarn build

FROM node:18.19-slim

WORKDIR /usr/src/app

COPY favicon.png .

COPY --from=build /usr/src/app/package.json .
COPY --from=build /usr/src/app/yarn.lock .
COPY --from=build /usr/src/app/.yarnrc.yml .
COPY --from=build /usr/src/app/tsconfig.json .

COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/src ./src
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/public ./public
COPY --from=build /usr/src/app/.yarn ./.yarn

RUN mkdir sqlite
