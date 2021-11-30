#!/bin/bash
set -x

cd ./request
npm run generate:client
npm i

cd ../../