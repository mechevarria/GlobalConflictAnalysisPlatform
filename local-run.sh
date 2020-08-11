#!/usr/bin/env bash

credentials=$(cf service-key gca-db gca-db-key | sed -n 3,14p)
if [[ -z "$credentials" ]]; then
  echo "service-key 'gca-db-key' not found"
  exit 1
fi

echo "{\"hana\": $credentials }" > /tmp/default-services.json

npm run lint && npm run dev