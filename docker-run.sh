<<<<<<< HEAD
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
=======
#!/usr/bin/env bash

credentials=$(cf service-key gca-db gca-db-key | sed -n 3,14p)
if [[ -z "$credentials" ]]; then
  echo "service-key 'gca-db-key' not found"
  exit 1
fi

echo "{\"hana\": $credentials }" >/tmp/default-services.json

app=gca-express

docker rm $app

docker run \
  --name=$app \
  -p 3000:3000 \
  --network app-net \
  --mount type=bind,source=/tmp/default-services.json,target=/tmp/default-services.json \
  quay.io/mechevarria/$app
>>>>>>> e3bc7f9c531557d215ebf77219248ced22a9102e
