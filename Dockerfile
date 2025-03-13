FROM node:20-alpine

WORKDIR /app

# copy pakacges
COPY package.json package-lock.json ./

# install dependencies
RUN npm ci

COPY .env.local ./
COPY docker-compose.yml ./
COPY eslint.config.mjs ./
COPY middleware.ts ./
COPY next.config.ts ./
COPY next-env.d.ts ./
COPY postcss.config.mjs ./
COPY README.md ./
COPY tsconfig.json ./
COPY app/ ./app/
COPY components/ ./components/
COPY lib/ ./lib/
COPY public/ ./public/

# build
RUN npm run build

# start the website
CMD ["npm", "start"]