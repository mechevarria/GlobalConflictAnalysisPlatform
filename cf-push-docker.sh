<<<<<<< HEAD
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

=======
#!/usr/bin/env bash

service=gca-db
status=$(cf service $service | sed -n 3p)
if [[ $status = "FAILED" ]]; then
  exit 1
fi

app=gca-express

cf push $app \
    -m 128M \
    -k 2048M \
    --docker-image quay.io/mechevarria/$app \
    --no-start

# bind hana service
cf bind-service $app $service

>>>>>>> e3bc7f9c531557d215ebf77219248ced22a9102e
cf start $app