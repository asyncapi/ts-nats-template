#!/bin/bash
set -x

cd ./publish\ subscribe
sh ./GenerateAndBuild.sh
sh ./Test.sh

cd ../request\ reply
sh ./GenerateAndBuild.sh
sh ./Test.sh

cd ../../