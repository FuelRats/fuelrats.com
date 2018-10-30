#!/bin/bash

DEPLOY_HOST="travis-deployment@emmental.fuelrats.com"
DEPLOY_DIR="trash"
SERVICE_NAME=""

case $TRAVIS_BRANCH in
develop)
  DEPLOY_DIR="dev.fuelrats.com"
  SERVICE_NAME="fuelratsweb_dev"
  ;;


beta)
  DEPLOY_DIR="beta.fuelrats.com"
  SERVICE_NAME="fuelratsweb_beta"
  ;;


master)
  DEPLOY_DIR="fuelrats.com"
  SERVICE_NAME="fuelratsweb"
  ;;


*)
  echo "Current branch is not configured for auto-deploy. skipping deployment..."
  exit 0
  ;;
esac

# Move built project files to server
rsync -r --delete-after --quiet $TRAVIS_BUILD_DIR/ $DEPLOY_HOST:/var/www/$DEPLOY_DIR/

# restart service
ssh -t $DEPLOY_HOST "sudo systemctl restart $SERVICE_NAME.service"
