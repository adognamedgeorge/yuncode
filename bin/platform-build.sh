#!/usr/bin/env bash

if [ -z "${1}" ]; then
    echo "Platform is missing"
    exit 0
fi

if [ ${1} != "android" -a ${1} != "ios" ]; then
    echo "Platform must be 'android' or 'ios'"
    exit 0
fi

if [ -d "builder/${1}/platforms/${1}" ]; then
    echo "Platform has been built"
    exit 0
fi

cd "builder/${1}"

if [ ! -d "www" ]; then
    mkdir www
fi

npm run build
echo "Platform build finish"
exit 0