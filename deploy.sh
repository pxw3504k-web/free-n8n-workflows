#!/bin/bash

# Exit on error
set -e

APP_NAME="ayn8n-clone"
REGION="us-central1" # You can change this to your preferred region

echo "Deploying $APP_NAME to Google Cloud Run..."

# Build the Docker image
# Note: We are using Google Cloud Build to build the image remotely to avoid local architecture issues (e.g. M1 Mac vs Linux)
# and to automatically push to the Container Registry / Artifact Registry.

echo "Submitting build to Google Cloud Build..."
gcloud builds submit --tag gcr.io/$GOOGLE_CLOUD_PROJECT/$APP_NAME .

echo "Deploying to Cloud Run..."
gcloud run deploy $APP_NAME \
  --image gcr.io/$GOOGLE_CLOUD_PROJECT/$APP_NAME \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --port 3000

echo "Deployment complete!"
