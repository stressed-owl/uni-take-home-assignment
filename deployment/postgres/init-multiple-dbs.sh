#!/bin/bash
set -e # Exit immediately if a command exits with a non-zero status.

echo "Creating databases for microservices..."

# We use the POSTGRES_USER environment variable as the user for all databases.
# You could also define separate users if needed.
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE DATABASE "fb_collector_db";
    CREATE DATABASE "ttk_collector_db";
    CREATE DATABASE "reporter_db";
EOSQL

echo "Databases created successfully!"
