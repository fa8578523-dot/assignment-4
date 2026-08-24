-- Assignment 4: Database Alterations & Migrations (Task 5)

-- 5a. Add a Category column to the Products table
ALTER TABLE "Products" 
ADD COLUMN IF NOT EXISTS "Category" VARCHAR(100) NULL;

-- 5b. Remove the Category column from the Products table
ALTER TABLE "Products" 
DROP COLUMN IF EXISTS "Category";

-- 5c. Change ContactNumber to VARCHAR(15)
ALTER TABLE "Suppliers" 
ALTER COLUMN "ContactNumber" TYPE VARCHAR(15);

-- 5d. Add a NOT NULL constraint to ProductName
ALTER TABLE "Products" 
ALTER COLUMN "ProductName" SET NOT NULL;
