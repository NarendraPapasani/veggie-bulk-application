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

# Run custom build script that handles Prisma setup
npm run build

# Verify the generated engine files for debugging
ls -la generated/prisma/