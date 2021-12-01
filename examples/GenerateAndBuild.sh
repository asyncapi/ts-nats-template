#!/bin/bash

#
# Generates all the example's clients and builds them.
#

set -x

# Loop through all examples and generate and build the libraries
for d in */ ; do
    cd "$d"
    npm run generate:client
    npm i
    cd ../
done

