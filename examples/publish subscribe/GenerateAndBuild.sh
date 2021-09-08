#!/bin/sh

rm -rf ./streetlight
../../node_modules/@asyncapi/generator/cli.js --output "./streetlight" "./streetlight.json" "../../" --force-write --param "generateTestClient=true" && cd ./streetlight && npm i && npm run build && cd ..