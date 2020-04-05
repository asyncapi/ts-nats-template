#!/usr/bin/env bash
set -x
unameOut="$(uname -s)"
case "${unameOut}" in
    Linux*)     machine="Linux";;
    Darwin*)    machine="Mac";;
    CYGWIN*)    machine="Cygwin";;
    MINGW*)     machine="MinGw";;
    *)          machine="UNKNOWN:${unameOut}"
esac
currentDir=${PWD}
echo ${machine}
if [ $machine == "MinGw" ]; then
	# Convert /c/ to C:/
	currentDir="${currentDir:1:1}:"
	currentDir="${currentDir^}"
	currentDir="${currentDir}${PWD:2}"
fi
mkdir ${currentDir}/test/actual_comparators/latest/frontend
mkdir ${currentDir}/test/actual_comparators/latest/light-controller


docker run --rm -it \
	-v ${currentDir}/test/docs/0.1.0/frontend.yml:/app/asyncapi.yml \
	-v ${currentDir}/test/docs/0.1.0/components:/app/components \
	-v ${currentDir}/test/actual_comparators/latest/frontend:/app/output \
	-v ${currentDir}:/app/template \
	asyncapi/generator:latest -o ./output ./asyncapi.yml ./template --force-write --install

docker run --rm -it \
	-v ${currentDir}/test/docs/0.1.0/light-controller.yml:/app/asyncapi.yml \
	-v ${currentDir}/test/docs/0.1.0/components:/app/components \
	-v ${currentDir}/test/actual_comparators/latest/light-controller:/app/output \
	-v ${currentDir}:/app/template \
	asyncapi/generator:latest -o ./output ./asyncapi.yml ./template --force-write --install

