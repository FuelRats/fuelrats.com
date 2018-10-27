#!/bin/bash

DEPLOY_USER="travis-deployment"
DEPLOY_HOST="cheddar.fuelrats.com"
DEPLOY_DIR=""

case $TRAVIS_BRANCH in
develop)
  DEPLOY_HOST="emmental.fuelrats.com"
  DEPLOY_DIR="dev.fuelrats.com"
  ;;


beta)
  DEPLOY_HOST="emmental.fuelrats.com"
  DEPLOY_DIR="beta.fuelrats.com"
  ;;


master)
  DEPLOY_DIR="fuelrats.com"
  ;;


*)
  echo "Script was executed on wrong branch. Exiting.."
  exit 0
  ;;
esac

# Move built project files to server
rsync -r --delete-after --quiet $TRAVIS_BUILD_DIR/ $DEPLOY_USER@$DEPLOY_HOST:/var/www/$DEPLOY_DIR/

# Rebuild native dependencies in new environment
ssh $DEPLOY_USER@$DEPLOY_HOST "cd /var/www/$DEPLOY_DIR; npm rebuild"
