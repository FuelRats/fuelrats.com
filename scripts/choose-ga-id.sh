#!/bin/bash

if [ $TRAVIS_BRANCH = 'develop' ]; then
  export GA_TRACKING_ID=$GA_TRACKING_ID_BETA
fi

if [ $TRAVIS_BRANCH = 'master' ]; then
  export GA_TRACKING_ID=$GA_TRACKING_ID_PROD
fi
