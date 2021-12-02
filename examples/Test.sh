#!/bin/bash

#
# Test all the example's
#

set -x

# Loop through all examples and test the implementations
for d in */ ; do
    cd "$d"
    npm run test
    cd ../
done

