#!/usr/bin/env bash

cd code
echo "Pack start"
ionic build --prod --minifyjs --minifycss --optimizejs
./node_modules/cordova-hot-code-push-cli/bin/cordova-hcp build

cd ..

if [ -d "builder/android/platforms/android" ]; then
    if [ -d "builder/android/www" ]; then
        echo "Remove android www"
        rm -rf builder/android/www
    fi

    echo "Copy code/www to builder/android"
    cp -R code/www builder/android

    cd builder/android
    echo "Publish android"
    cordova prepare

    cd ../..
fi

if [ -d "builder/ios/platforms/ios" ]; then
    if [ -d "builder/ios/www" ]; then
        echo "Remove ios www"
        rm -rf builder/ios/www
    fi

    echo "Copy code/www to builder/ios"
    cp -R code/www builder/ios

    cd builder/ios
    echo "Publish ios"
    cordova prepare

    cd ../..
fi

echo "Pack finish"

exit 0
