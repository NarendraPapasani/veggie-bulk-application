#!/usr/bin/env bash
# filepath: c:\Users\papas\new_assign\backend\render-build.sh

# Exit on error
set -e

# Log each command for debugging
set -x

# Install dependencies 
npm install

# Set to production environment
export NODE_ENV=production

# Set Prisma binary target environment variables
export PRISMA_SCHEMA_ENGINE_BINARY="schema-engine-debian-openssl-3.0.x"
export PRISMA_QUERY_ENGINE_BINARY="query-engine-debian-openssl-3.0.x"
export PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1

# Run custom build script that handles Prisma setup
npm run build

# Attempt to generate again if the build script failed
if [ ! -f "./generated/prisma/libquery_engine-debian-openssl-3.0.x.so.node" ]; then
  echo "Engine not found, generating again directly..."
  npx prisma generate
fi

# Verify the generated engine files for debugging
ls -la generated/prisma/ || echo "Directory not found"