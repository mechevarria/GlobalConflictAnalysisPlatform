#!/usr/bin/env bash

service=gca-db
status=$(cf service $service | sed -n 3p)
if [[ $status = "FAILED" ]]; then
  exit 1
fi

app=gca-express-buildpack

cf push $app \
    -b nodejs_buildpack \
    --no-start \
    -m 256M \
    -k 1048M

# bind hana service
cf bind-service $app $service

cf start $app
