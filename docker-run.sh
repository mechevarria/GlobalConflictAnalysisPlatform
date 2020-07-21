#!/usr/bin/env bash

app=gca-express

docker rm $app

docker run \
  --name=$app \
  -p 3000:3000 \
  --network app-net \
  --env HDB_HOST=$HDB_HOST \
  --env HDB_PORT=$HDB_PORT \
  --env HDB_USER=$HDB_USER \
  --env HDB_PASSWORD=$HDB_PASSWORD \
  quay.io/mechevarria/$app
