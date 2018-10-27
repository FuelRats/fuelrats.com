#!/bin/bash

# Move built project files to server
rsync -r --delete-after --quiet $TRAVIS_BUILD_DIR/ travis-deployment@cheddar.fuelrats.com:/var/www/fuelrats.com/

# Rebuild native dependencies in new environment
ssh travis-deployment@cheddar.fuelrats.com "cd /var/www/fuelrats.com; npm rebuild"
