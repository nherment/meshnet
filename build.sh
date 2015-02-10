#!/bin/sh

cd build
rm -rf *
cmake -DCMAKE_C_FLAGS="-std=gnu99" ..
make
