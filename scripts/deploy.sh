#!/bin/bash

DEPLOY_DIR="trash"
SERVICE_NAME=""

case $TRAVIS_BRANCH in
develop)
  DEPLOY_DIR="dev.fuelrats.com"
  SERVICE_NAME="fr-web_dev"
  ;;


beta)
  DEPLOY_DIR="beta.fuelrats.com"
  SERVICE_NAME="fr-web_beta"
  ;;


master)
  DEPLOY_DIR="fuelrats.com"
  SERVICE_NAME="fr-web"
  ;;


*)
  echo "Current branch is not configured for auto-deploy. skipping deployment..."
  exit 0
  ;;
esac

# Move built project files to server
rsync -r --delete-after --quiet $TRAVIS_BUILD_DIR/ travis-deployment@emmental.fuelrats.com:/var/www/$DEPLOY_DIR/

# restart service
ssh -t travis-deployment@emmental.fuelrats.com "sudo systemctl restart $SERVICE_NAME.service"
