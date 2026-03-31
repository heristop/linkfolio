#!/bin/bash

set -e

tsdown --tsconfig tsconfig.build.json && mkdir -p ./dist/assets/img && cp -a ./src/assets/globals.css ./dist/assets && cp -a ./src/assets/index.ts ./dist/assets && cp -a ./src/assets/img/*.svg ./dist/assets/img
