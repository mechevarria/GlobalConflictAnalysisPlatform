#!/usr/bin/env bash

app=gca-express-buildpack

cf push $app \
    -b nodejs_buildpack \
    --no-start \
    -m 256M \
    -k 1048M

cf se $app HDB_HOST $HDB_HOST
cf se $app HDB_PORT $HDB_PORT
cf se $app HDB_USER $HDB_USER
cf se $app HDB_PASSWORD $HDB_PASSWORD

cf start $app
