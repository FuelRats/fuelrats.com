#!/bin/bash

# Variables

DEPLOY_DIR="trash"
SERVICE_NAME=""

# output branch name for testing just to make sure
echo $GITHUB_REF

# Find deploy target and service name
case $GITHUB_REF in
"refs/heads/develop")
  DEPLOY_DIR="dev.fuelrats.com"
  SERVICE_NAME="fr-web_dev"
  ;;


"refs/heads/release")
  DEPLOY_DIR="fuelrats.com"
  SERVICE_NAME="fr-web"
  ;;

"refs/heads/gha-deploy")
  SERVICE_NAME="VOID"
  ;;

*)
  echo "Current branch is not configured for auto-deploy. skipping deployment..."
  exit 1
  ;;
esac

# Move built project files to server
rsync -r --delete-after ./ fuelrats@emmental.fuelrats.com:/var/www/$DEPLOY_DIR/

# restart service
# ssh -t fuelrats@emmental.fuelrats.com "sudo systemctl restart $SERVICE_NAME.service"
