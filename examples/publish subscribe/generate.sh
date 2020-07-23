#!/bin/sh

ag --install --output "./streetlight" "./streetlight.json" "../../" --force-write --param "generateTestClient=true"  --param "promisifyReplyCallback=true"