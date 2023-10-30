#!/bin/bash

set -e

tsup --tsconfig tsconfig.build.json --onSuccess "cp -a ./src/assets/globals.css ./dist/assets && cp -a ./src/assets/index.ts ./dist/assets && cp -a ./src/assets/img/*.svg ./dist/assets/img"
