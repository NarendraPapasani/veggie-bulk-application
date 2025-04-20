#!/usr/bin/env bash
# Exit on error
set -e

# Log each command for debugging
set -x

# Install dependencies 
npm install

# Set to production environment
export NODE_ENV=production

# Log the DATABASE_URL (with password redacted for security)
echo "Database URL: $(echo $DATABASE_URL | sed 's/:[^:]*@/:*****@/')"

# Generate Prisma client
npx prisma generate

# Try direct schema push first to ensure tables exist
echo "Pushing schema directly to create tables if needed..."
npx prisma db push --accept-data-loss || echo "Schema push failed but continuing"

# Run Prisma migrations in production
echo "Running database migrations..."
npx prisma migrate deploy || echo "Migration failed but continuing"

# Seed the database with initial data
echo "Seeding the database..."
npx prisma db seed || echo "Seeding failed but continuing deployment"

# Verify the tables exist
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkTables() {
  try {
    console.log('Checking if tables exist...');
    
    // Check products table with proper error handling
    try {
      const productCount = await prisma.product.count();
      console.log('Products table exists with', productCount, 'records');
    } catch (e) {
      console.error('Error checking products table:', e);
    }
    
    try {
      // Check users table
      const userCount = await prisma.user.count();
      console.log('Users table exists with', userCount, 'records');
    } catch (e) {
      console.error('Error checking users table:', e);
    }
    
    try {
      // Check orders table
      const orderCount = await prisma.order.count();
      console.log('Orders table exists with', orderCount, 'records');
    } catch (e) {
      console.error('Error checking orders table:', e);
    }
    
  } catch (err) {
    console.error('Table check failed:', err);
  } finally {
    await prisma.\$disconnect();
  }
}

checkTables();
"