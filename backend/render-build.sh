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

# Run Prisma migrations in production
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate

# Verify the connection to the database
node -e "const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); async function test() { try { console.log('Testing database connection...'); await prisma.$connect(); console.log('Database connection successful!'); } catch (err) { console.error('Database connection failed:', err); process.exit(1); } finally { await prisma.$disconnect(); } } test()"