#!/bin/bash

rsync -r --delete-after --quiet $TRAVIS_BUILD_DIR/ travis-deployment@cheddar.fuelrats.com:/var/www/fuelrats.com/
rsync -r --delete-after --quiet $TRAVIS_BUILD_DIR/ travis-deployment@cheddar.fuelrats.com:/var/www/beta.fuelrats.com/