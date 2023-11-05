#!/bin/sh

set -o errexit
set -o pipefail
set -o nounset

# Run pending migrations
npm run migration:run

# Start server in development mode
npm run start:dev
