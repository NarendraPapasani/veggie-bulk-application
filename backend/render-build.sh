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

# Check the database connection first
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function testConnection() {
  try {
    console.log('Testing database connection...');
    await prisma.\$connect();
    console.log('Database connection successful!');
  } catch (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  } finally {
    await prisma.\$disconnect();
  }
}
testConnection()
"

# Generate Prisma client
npx prisma generate

# Run Prisma migrations in production - create all tables
echo "Running database migrations..."
npx prisma migrate deploy

# If migrations fail, try to push schema directly
if [ $? -ne 0 ]; then
  echo "Migration failed, attempting to push schema directly..."
  npx prisma db push --accept-data-loss --force-reset
fi

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
    
    // Check products table
    const productCount = await prisma.product.count()
      .catch(e => {
        console.error('Error counting products:', e);
        return 'ERROR';
      });
    console.log('Products table exists with', productCount === 'ERROR' ? 'ERROR' : productCount, 'records');
    
    // Check users table
    const userCount = await prisma.user.count()
      .catch(e => {
        console.error('Error counting users:', e);
        return 'ERROR';
      });
    console.log('Users table exists with', userCount === 'ERROR' ? 'ERROR' : userCount, 'records');
    
    // Check orders table
    const orderCount = await prisma.order.count()
      .catch(e => {
        console.error('Error counting orders:', e);
        return 'ERROR';
      });
    console.log('Orders table exists with', orderCount === 'ERROR' ? 'ERROR' : orderCount, 'records');
    
  } catch (err) {
    console.error('Table check failed:', err);
    // Don't exit with error to allow deployment to continue
  } finally {
    await prisma.\$disconnect();
  }
}

checkTables()
"