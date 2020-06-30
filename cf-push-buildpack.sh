#!/usr/bin/env bash

status=$(cf app keycloak-coreui | sed -n 3p)
if [[ $status = "FAILED" ]]; then
  exit 1
else
  keycloak_url=https://$(cf app keycloak-coreui | awk '{print $2}' | sed -n 5p)/auth
  echo keycloak_url=$keycloak_url
fi

service=hdi_hana
status=$(cf service $service | sed -n 3p)
if [[ $status = "FAILED" ]]; then
  exit 1
fi

app=express-api

cd $app

cf push $app \
    -b nodejs_buildpack \
    --no-start \
    -m 64M \
    -k 2048M

cf se $app KEYCLOAK_URL $keycloak_url
cf se $app KEYCLOAK false

# bind hana service
cf bind-service $app $service

cf start $app

cd ..