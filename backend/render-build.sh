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

# Log the DATABASE_URL (with password redacted for security)
echo "Database URL: $(echo $DATABASE_URL | sed 's/:[^:]*@/:*****@/')"

# Generate Prisma client first
npx prisma generate

# Run Prisma migrations in production - create all tables
echo "Running database migrations..."
npx prisma migrate deploy

# If migrations fail, try to create the schema directly
if [ $? -ne 0 ]; then
  echo "Migration failed, attempting to push schema directly..."
  npx prisma db push --accept-data-loss
fi

# Seed the database with initial data
echo "Seeding the database..."
npx prisma db seed

# Verify the connection to the database and check if tables exist
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    console.log('Testing database connection...');
    await prisma.\$connect();
    console.log('Database connection successful!');
    
    // Check if products table exists by trying to count products
    const productCount = await prisma.product.count();
    console.log('Products table exists with', productCount, 'records');
    
  } catch (err) {
    console.error('Database test failed:', err);
    process.exit(1);
  } finally {
    await prisma.\$disconnect();
  }
}

test()
"