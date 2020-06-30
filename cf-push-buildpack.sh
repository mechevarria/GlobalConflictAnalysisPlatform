#!/usr/bin/env bash

app=conflict-analysis

cf push $app \
    -b https://github.com/cloudfoundry/nodejs-buildpack.git \
    --no-start \
    -m 512M \
    -k 1048M

cf se $app HDB_HOST $HDB_HOST
cf se $app HDB_PORT $HDB_PORT
cf se $app HDB_USER $HDB_USER
cf se $app HDB_PASSWORD $HDB_PASSWORD
cf se $app MAPBOX_TOKEN $MAPBOX_TOKEN

cf start $app