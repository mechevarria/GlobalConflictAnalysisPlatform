#!/usr/bin/env bash

app=gca-express

cf push $app \
    -m 128M \
    -k 2048M \
    --docker-image quay.io/mechevarria/$app \
    --no-start

cf se $app HDB_HOST $HDB_HOST
cf se $app HDB_PORT $HDB_PORT
cf se $app HDB_USER $HDB_USER
cf se $app HDB_PASSWORD $HDB_PASSWORD

cf start $app