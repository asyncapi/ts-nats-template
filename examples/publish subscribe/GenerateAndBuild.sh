#!/bin/sh

ag --output "./streetlight" "./streetlight.json" "../../" --force-write --param "generateTestClient=true" --param "promisifyReplyCallback=true" && cd ./streetlight && npm i && npm run build && cd ../../.. && ls