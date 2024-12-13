#!/bin/bash

# ============================================
# Script to Dump Supabase Public Schema for Private Labeling
# ============================================

# Function to display error messages and exit
function error_exit {
  echo "Error: $1" >&2
  exit 1
}

# ============================================
# Step 1: Load Environment Variables
# ============================================

echo "Loading environment variables from .env.local file..."

ENV_FILE="../.env.local"

if [ -f "$ENV_FILE" ]; then
  # Export all variables from the .env.local file
  set -o allexport
  source "$ENV_FILE"
  set +o allexport
  echo ".env.local file found and loaded successfully."
else
  error_exit ".env.local file not found! Please ensure it exists in the parent directory."
fi

# ============================================
# Step 2: Verify Required Environment Variables
# ============================================

echo "Checking for required Supabase environment variables..."

# List of required variables (adjust as necessary)
REQUIRED_VARS=("SUPABASE_DB_USER")

for var in "${REQUIRED_VARS[@]}"; do
  if [ -z "${!var}" ]; then
    error_exit "Environment variable $var is not set. Please define it in the .env.local file."
  else
    echo "✔ $var is set."
  fi
done

# ============================================
# Step 3: Set Supabase Connection Parameters
# ============================================

# Use existing environment variables or set defaults if needed
SUPABASE_DB_HOST="${SUPABASE_DB_HOST:-aws-0-us-east-1.pooler.supabase.com}"
SUPABASE_DB_PORT="${SUPABASE_DB_PORT:-6543}"
SUPABASE_DB_NAME="${SUPABASE_DB_NAME:-postgres}"

DB_USER="$SUPABASE_DB_USER"

echo "Supabase Connection Details:"
echo "Host: $SUPABASE_DB_HOST"
echo "Port: $SUPABASE_DB_PORT"
echo "Database Name: $SUPABASE_DB_NAME"
echo "User: $DB_USER"

# ============================================
# Step 4: Prompt for Database Password
# ============================================

echo "Please enter the password for user '$DB_USER':"
read -s DB_PASSWORD
echo "Password entered."

# ============================================
# Step 5: Construct PostgreSQL Connection URL
# ============================================

PG_DUMP_CONNECTION_URL="postgres://$DB_USER@$SUPABASE_DB_HOST:$SUPABASE_DB_PORT/$SUPABASE_DB_NAME"

# Get the current date and time for the filename
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M")
DUMP_FILE="dump_supabase_public_${TIMESTAMP}.sql"

echo "Connecting to Supabase at host: $SUPABASE_DB_HOST on port $SUPABASE_DB_PORT"
echo "Starting the public schema dump and saving it as $DUMP_FILE..."

# ============================================
# Step 6: Perform Schema-Only Dump for Public Schema
# ============================================

# Export PGPASSWORD to use with pg_dump
export PGPASSWORD="$DB_PASSWORD"

# Perform a schema-only database dump for the public schema
pg_dump "$PG_DUMP_CONNECTION_URL" \
  --username="$DB_USER" \
  --schema=public \
  --schema-only \
  --file="$DUMP_FILE" \
  --no-owner \
  --no-privileges

# Check if pg_dump was successful
if [ $? -eq 0 ]; then
  echo "✔ Public schema dump completed successfully."
  echo "Schema saved to $DUMP_FILE."
else
  error_exit "Schema dump failed! Please check the Supabase connection and credentials."
fi

# Unset PGPASSWORD for security
unset PGPASSWORD

# ============================================
# (Optional) Further Processing Steps
# ============================================

# If you need to perform additional actions after the dump,
# such as uploading to a storage service or integrating with your deployment pipeline,
# you can add those steps here.

echo "======================================="
echo "        SCHEMA DUMP SCRIPT COMPLETE"
echo "======================================="
