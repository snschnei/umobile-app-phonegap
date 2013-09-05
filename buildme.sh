#!/bin/bash

if [ $1 == "android" ]
then
    echo "Compiling for Android"
    grunt prod --environment=android --auth=cas &&
    grunt push.prod
    cd ..
    ant clean debug uninstall install
elif [ $1 == "web" ]
then
    echo "Compiling for Web"
    grunt dev --environment=web --auth=mock &&
    grunt push.dev
elif [ $1 == "ios" ]
then
    echo "Compiling for ios"
    grunt prod --environment=ios --auth=cas &&
    grunt push.prod
    cd .. && cd cordova
    ./emulate
else
    echo "Must use parameter android, iso, web to compile"
fi
