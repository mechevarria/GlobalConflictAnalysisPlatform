<<<<<<< HEAD
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
=======
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
>>>>>>> e3bc7f9c531557d215ebf77219248ced22a9102e
