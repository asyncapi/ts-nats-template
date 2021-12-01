#!/bin/bash

#
# Generates all the example's clients and builds them.
#

set -x

cd ./request
npm run generate:client
npm i

cd ../../