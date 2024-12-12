#!/bin/bash

# Load environment variables from .env file
echo "Loading environment variables from .env file..."
if [ -f "../.env" ]; then
  set -o allexport
  source ../.env
  set +o allexport
  echo ".env file found and loaded successfully."
else
  echo "Error: .env file not found! Please make sure the .env file exists in the current directory."
  exit 1
fi

# Confirm required environment variables are loaded
echo "Checking for Supabase credentials in environment variables..."
if [ -z "$SUPABASE_DB_USER" ]; then
  echo "Error: Required Supabase environment variables are not set correctly in the .env file."
  exit 1
else
  echo "Supabase database user found and loaded correctly."
fi

# Use the working Supabase host and port
PG_DUMP_HOST="aws-0-us-east-1.pooler.supabase.com"
PG_DUMP_PORT="6543"

# Get database user from the .env file
DB_USER=$SUPABASE_DB_USER

# Prompt for password interactively
echo "Please enter the password for user $DB_USER:"
read -s DB_PASSWORD

# Construct the Postgres connection string (password will be prompted)
PG_DUMP_CONNECTION_URL="postgres://$DB_USER@$PG_DUMP_HOST:$PG_DUMP_PORT/postgres"

# Get the current date and time for the filename
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M")

# Set the filename for the dump file
DUMP_FILE="dump_supabase_${TIMESTAMP}.sql"

echo "Connecting to Supabase at host: $PG_DUMP_HOST on port $PG_DUMP_PORT"
echo "Starting the database schema dump and saving it as $DUMP_FILE..."

# Perform a schema-only database dump (no data)
pg_dump "$PG_DUMP_CONNECTION_URL" --username=$DB_USER --schema-only --file=$DUMP_FILE

if [ $? -eq 0 ]; then
  echo "Database schema dump complete. Dump saved to $DUMP_FILE."
else
  echo "Error: Database dump failed! Please check the Supabase connection and credentials."
  exit 1
fi

# Now continue with the file concatenation process
echo "======================================="
echo "Beginning the concatenation of files..."
echo "======================================="

# Output file for concatenation
output_file="dump_gpt_concat_output.txt"

echo "Initializing concatenation of files..."
echo "Output file: $output_file"

# Clear the output file if it exists
if [ -f "$output_file" ]; then
  echo "Clearing existing output file: $output_file"
  > $output_file
else
  echo "No existing output file found. Creating a new one..."
fi

# Add the output of the tree command to the file
echo "Adding the directory structure to $output_file"
echo -e "\n### Directory Structure\n" >> $output_file
tree -L 2 >> $output_file

# Process and concatenate the files in the app/ directory except for docs, examples, perf, select table
echo "Processing files under app/ directory..."
for dir in $(find app -mindepth 1 -maxdepth 1 -type d | grep -vE "app/docs|app/examples|app/perf|app/select_table"); do
  for file in $(find $dir -type f); do
    echo "Adding file: $file"
    echo -e "\n### File: $file\n" >> $output_file
    cat "$file" >> $output_file
    echo -e "\n// End of file: $file\n" >> $output_file
  done
done

# Process and concatenate the files in components/ directory except for ads, code-window, demos, docs, featurebase, icons, sandpack
echo "Processing files under components/ directory..."
for dir in $(find components -mindepth 1 -maxdepth 1 -type d | grep -vE "components/ads|components/code-window|components/demos|components/docs|components/featurebase|components/icons|components/sandpack"); do
  for file in $(find $dir -type f); do
    echo "Adding file: $file"
    echo -e "\n### File: $file\n" >> $output_file
    cat "$file" >> $output_file
    echo -e "\n// End of file: $file\n" >> $output_file
  done
done

# Concatenate everything in config/, types/, and utils/ directories
for dir in config types utils; do
  echo "Processing files under $dir/ directory..."
  for file in $(find $dir -type f); do
    echo "Adding file: $file"
    echo -e "\n### File: $file\n" >> $output_file
    cat "$file" >> $output_file
    echo -e "\n// End of file: $file\n" >> $output_file
  done
done

echo "Concatenation of files complete. Final output saved to $output_file."

# Count the number of lines in the concatenated file
concat_lines=$(wc -l < "$output_file")
echo "The concatenated output file $output_file contains $concat_lines lines."

echo "======================================="
echo "        SCRIPT EXECUTION COMPLETE"
echo "======================================="
