-- Assignment 4: PostgreSQL Database Schema (Task 1)
-- Run this script in PostgreSQL to create the tables

-- 1. Create Suppliers Table
CREATE TABLE IF NOT EXISTS "Suppliers" (
  "SupplierID" SERIAL PRIMARY KEY,
  "SupplierName" VARCHAR(150) NOT NULL,
  "ContactNumber" VARCHAR(50) NULL
);

-- 2. Create Products Table
CREATE TABLE IF NOT EXISTS "Products" (
  "ProductID" SERIAL PRIMARY KEY,
  "ProductName" VARCHAR(200) NOT NULL,
  "Price" DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  "StockQuantity" INT NOT NULL DEFAULT 0,
  "SupplierID" INT NULL REFERENCES "Suppliers"("SupplierID") ON DELETE SET NULL
);

-- 3. Create Sales Table
CREATE TABLE IF NOT EXISTS "Sales" (
  "SaleID" SERIAL PRIMARY KEY,
  "ProductID" INT NOT NULL REFERENCES "Products"("ProductID") ON DELETE CASCADE,
  "QuantitySold" INT NOT NULL DEFAULT 1,
  "SaleDate" DATE NOT NULL DEFAULT CURRENT_DATE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_supplier ON "Products"("SupplierID");
CREATE INDEX IF NOT EXISTS idx_sales_product ON "Sales"("ProductID");
CREATE INDEX IF NOT EXISTS idx_sales_date ON "Sales"("SaleDate");
