-- Assignment 4: User Management & Permissions (Tasks 14, 15, 16)

-- Task 14: Create PostgreSQL user named store_manager and grant SELECT, INSERT, UPDATE on all tables
DO $$ BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'store_manager') THEN
        CREATE USER store_manager WITH PASSWORD 'StoreManagerPass123!';
    END IF;
END $$;

GRANT CONNECT ON DATABASE store_management_db TO store_manager;
GRANT USAGE ON SCHEMA public TO store_manager;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO store_manager;

-- Task 15: Revoke UPDATE permission from store_manager on all tables
REVOKE UPDATE ON ALL TABLES IN SCHEMA public FROM store_manager;

-- Task 16: Grant DELETE permission to store_manager only on the Sales table
GRANT DELETE ON "Sales" TO store_manager;
