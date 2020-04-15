#!/bin/bash

# Variables

DEPLOY_DIR="trash"
SERVICE_NAME=""

# Find deploy target and service name
case $1 in
develop)
  DEPLOY_DIR="dev.fuelrats.com"
  SERVICE_NAME="fr-web_dev"
  ;;


master)
  DEPLOY_DIR="fuelrats.com"
  SERVICE_NAME="fr-web"
  ;;


*)
  echo "Current branch is not configured for auto-deploy. skipping deployment..."
  exit 1
  ;;
esac

# Move built project files to server
rsync -r --delete-after ./deploy_dist/ fuelrats@emmental.fuelrats.com:/var/www/$DEPLOY_DIR/

# restart service
ssh -t fuelrats@emmental.fuelrats.com "sudo systemctl restart $SERVICE_NAME.service"
