# Docker Secrets

This directory contains secret files for Docker Compose. 

## Setup

1. Copy the example files and remove the `.example` extension:
   ```bash
   cp fr_api_key.txt.example fr_api_key.txt
   # Repeat for other secrets
   ```

2. Edit each file to contain only the secret value (no newlines or extra spaces)

## Files needed:
- `fr_api_key.txt` - Fuel Rats API client ID
- `fr_api_secret.txt` - Fuel Rats API client secret  
- `fr_stripe_api_pk.txt` - Stripe publishable key
- `fr_stripe_api_sk.txt` - Stripe secret key
- `fr_stripe_bans_file.txt` - Path to Stripe bans file
- `qms_api_token.txt` - QMS API token

## How it works

The application will:
1. First check for Docker secrets at `/run/secrets/<secret_name>`
2. Fall back to environment variables if secrets are not found

This allows you to use either:
- Docker secrets (more secure for production)
- Environment variables (easier for development)