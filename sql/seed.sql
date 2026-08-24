-- Assignment 4: Seed Data Script (Task 6)

-- 1. Insert FreshFoods Supplier (Task 6a)
INSERT INTO "Suppliers" ("SupplierID", "SupplierName", "ContactNumber")
VALUES (1, 'FreshFoods', '01001234567')
ON CONFLICT ("SupplierID") DO UPDATE SET "SupplierName" = EXCLUDED."SupplierName", "ContactNumber" = EXCLUDED."ContactNumber";

-- Reset sequence for Suppliers
SELECT setval('public."Suppliers_SupplierID_seq"', (SELECT MAX("SupplierID") FROM "Suppliers"));

-- 2. Insert Products (Task 6b)
INSERT INTO "Products" ("ProductID", "ProductName", "Price", "StockQuantity", "SupplierID") VALUES
(1, 'Milk', 15.00, 50, 1),
(2, 'Bread', 10.00, 30, 1),
(3, 'Eggs', 20.00, 40, 1)
ON CONFLICT ("ProductID") DO UPDATE SET 
  "ProductName" = EXCLUDED."ProductName",
  "Price" = EXCLUDED."Price",
  "StockQuantity" = EXCLUDED."StockQuantity",
  "SupplierID" = EXCLUDED."SupplierID";

-- Reset sequence for Products
SELECT setval('public."Products_ProductID_seq"', (SELECT MAX("ProductID") FROM "Products"));

-- 3. Insert Sale Record (Task 6c)
INSERT INTO "Sales" ("SaleID", "ProductID", "QuantitySold", "SaleDate")
VALUES (1, 1, 2, '2025-05-20')
ON CONFLICT ("SaleID") DO UPDATE SET
  "ProductID" = EXCLUDED."ProductID",
  "QuantitySold" = EXCLUDED."QuantitySold",
  "SaleDate" = EXCLUDED."SaleDate";

-- Reset sequence for Sales
SELECT setval('public."Sales_SaleID_seq"', (SELECT MAX("SaleID") FROM "Sales"));
