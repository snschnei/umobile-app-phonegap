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
else
    echo "Must use parameter android or web to compile"
fi
