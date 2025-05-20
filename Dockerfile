FROM node:20-alpine

WORKDIR /app/tmp

COPY . .

RUN cp docker.env backend/

# Build frontend
ADD docker.env frontend/
RUN cd frontend && \
  yarn && \
  yarn build

# Build backend
RUN cd backend && \
  yarn && \
  yarn build

RUN mkdir -p backend/dist/client
RUN cp -r frontend/dist/* backend/dist/client

WORKDIR /app

RUN mv tmp/backend/* .
RUN mv docker.env .env
RUN rm -rf tmp

EXPOSE 3000

ENTRYPOINT [ "yarn", "start:prod" ]