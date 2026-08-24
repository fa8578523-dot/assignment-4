# Route Assignment 4: Store Management REST API (PostgreSQL Edition) 🛒🐘

A complete RESTful API built with **Node.js**, **Express.js**, and **PostgreSQL** (`pg`) fulfilling all **16 tasks** of Assignment 4.

---

## 📁 Directory Structure

```
store-management-api/
│
├── server.js               # Express application entry point & route mounting
├── package.json            # Node.js dependencies (express, pg, dotenv, etc.)
├── package-lock.json       # Dependency lock file
├── .env                    # Active PostgreSQL environment variables
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore file
│
├── config/
│   └── db.js               # PostgreSQL pool connection (pg.Pool) & health check
│
├── routes/
│   ├── productRoutes.js    # Task 2 (CRUD), Task 7, Task 8, Task 10, Task 12 routes
│   ├── supplierRoutes.js   # Task 3 (CRUD), Task 11 routes
│   ├── saleRoutes.js       # Task 4 (Sales CRUD), Task 13 (JOIN query) routes
│   ├── reportRoutes.js     # Task 9 (Total sold per product aggregate) route
│   └── adminRoutes.js      # Task 5 (Migrations), Task 6 (Seed), Tasks 14-16 (Permissions)
│
├── controllers/
│   ├── productController.js  # Product logic (CRUD, update bread price, delete eggs, highest stock, never sold)
│   ├── supplierController.js # Supplier logic (CRUD, suppliers starting with F)
│   ├── saleController.js     # Sales logic (record sale, sales per product, detailed JOIN sales)
│   ├── reportController.js   # Aggregate report logic (SUM of QuantitySold)
│   └── adminController.js    # Migration alterations, seed execution & user privilege logic
│
├── sql/
│   ├── database.sql        # Task 1: Create Suppliers, Products, and Sales tables
│   ├── migrations.sql      # Task 5: Database column alterations (Add/Remove Category, Modify ContactNumber, NOT NULL)
│   ├── seed.sql            # Task 6: Seed FreshFoods, Milk, Bread, Eggs & Sale of 2 Milk
│   └── users.sql           # Tasks 14, 15, 16: PostgreSQL store_manager creation & GRANT/REVOKE commands
│
└── README.md               # Complete assignment task documentation & API guide
```

---

## 📑 Assignment 4 Tasks & API Mapping (All 16 Tasks)

| Task # | Assignment Description | HTTP Method | API Endpoint / SQL File | Description / Result |
| :---: | :--- | :---: | :--- | :--- |
| **1** | Connection pool & create `Products`, `Suppliers`, `Sales` tables | — | `sql/database.sql` / `config/db.js` | Configures `pg.Pool` & builds relational tables with FKs. |
| **2a** | Create a product | `POST` | `/api/products` | Adds product (`ProductName`, `Price`, `StockQuantity`, `SupplierID`). |
| **2b** | Retrieve all products | `GET` | `/api/products` | Returns array of all products in `Products` table. |
| **2c** | Retrieve product by ID | `GET` | `/api/products/:id` | Returns single product details by `ProductID`. |
| **2d** | Update a product | `PUT` | `/api/products/:id` | Updates fields for a product by `ProductID`. |
| **2e** | Delete a product | `DELETE` | `/api/products/:id` | Deletes product record by `ProductID`. |
| **3a** | Create a supplier | `POST` | `/api/suppliers` | Adds supplier (`SupplierName`, `ContactNumber`). |
| **3b** | Retrieve all suppliers | `GET` | `/api/suppliers` | Returns all records from `Suppliers` table. |
| **3c** | Update supplier information | `PUT` | `/api/suppliers/:id` | Updates supplier fields by `SupplierID`. |
| **3d** | Delete a supplier | `DELETE` | `/api/suppliers/:id` | Deletes supplier record by `SupplierID`. |
| **4a** | Record a sale | `POST` | `/api/sales` | Adds sale record (`ProductID`, `QuantitySold`, `SaleDate`). |
| **4b** | Retrieve all sales | `GET` | `/api/sales` | Returns all records from `Sales` table. |
| **4c** | Retrieve sales for a specific product | `GET` | `/api/sales/product/:productId` | Returns sales filtered by `ProductID`. |
| **5a** | Add `Category` column to `Products` | `POST` | `/api/admin/migrations/add-category` | `ALTER TABLE "Products" ADD COLUMN "Category" VARCHAR(100)` |
| **5b** | Remove `Category` column | `DELETE` | `/api/admin/migrations/remove-category` | `ALTER TABLE "Products" DROP COLUMN "Category"` |
| **5c** | Change `ContactNumber` to `VARCHAR(15)` | `PATCH` | `/api/admin/migrations/modify-contact-number` | `ALTER TABLE "Suppliers" ALTER COLUMN "ContactNumber" TYPE VARCHAR(15)` |
| **5d** | Add `NOT NULL` constraint to `ProductName` | `PATCH` | `/api/admin/migrations/add-not-null-product-name` | `ALTER TABLE "Products" ALTER COLUMN "ProductName" SET NOT NULL` |
| **6** | Seed data ('FreshFoods', 'Milk', 'Bread', 'Eggs', Sale of 2 Milk) | `POST` | `/api/admin/seed` (or `sql/seed.sql`) | Inserts FreshFoods supplier, 3 products, and 2 Milk sale record. |
| **7** | Update price of 'Bread' to 25.00 | `PUT` | `/api/products/special/update-bread-price` | `UPDATE "Products" SET "Price" = 25.00 WHERE "ProductName" = 'Bread'` |
| **8** | Delete product 'Eggs' | `DELETE` | `/api/products/special/delete-eggs` | `DELETE FROM "Products" WHERE "ProductName" = 'Eggs'` |
| **9** | Total quantity sold per product using SQL aggregates | `GET` | `/api/reports/total-sold-per-product` | `SELECT ProductName, SUM(QuantitySold) GROUP BY ProductID, ProductName` |
| **10** | Retrieve product with highest stock quantity | `GET` | `/api/products/special/highest-stock` | `SELECT * FROM "Products" ORDER BY "StockQuantity" DESC LIMIT 1` |
| **11** | Retrieve suppliers starting with 'F' | `GET` | `/api/suppliers/special/starts-with-f` | `SELECT * FROM "Suppliers" WHERE "SupplierName" ILIKE 'F%'` |
| **12** | Retrieve products that have never been sold | `GET` | `/api/products/special/never-sold` | `SELECT * FROM "Products" WHERE "ProductID" NOT IN (SELECT "ProductID" FROM "Sales")` |
| **13** | Retrieve all sales with `ProductName`, `QuantitySold`, `SaleDate` via `JOIN` | `GET` | `/api/sales/detailed` | `SELECT p.ProductName, s.QuantitySold, s.SaleDate FROM "Sales" s JOIN "Products" p ...` |
| **14** | Create user `store_manager` (SELECT, INSERT, UPDATE) | `POST` | `/api/admin/permissions/store-manager` (or `sql/users.sql`) | Creates `store_manager` & grants SELECT, INSERT, UPDATE permissions. |
| **15** | Revoke `UPDATE` permission from `store_manager` | `POST` | `/api/admin/permissions/store-manager` (or `sql/users.sql`) | `REVOKE UPDATE ON ALL TABLES FROM store_manager` |
| **16** | Grant `DELETE` permission to `store_manager` on `Sales` table | `POST` | `/api/admin/permissions/store-manager` (or `sql/users.sql`) | `GRANT DELETE ON "Sales" TO store_manager` |

---

## 🚀 Quick Setup & Running Instructions

### 1. Database Setup in PostgreSQL
Run `psql` to create the database and load the schema, seed data, and permissions:
```bash
createdb -U postgres store_management_db
psql -U postgres -d store_management_db -f sql/database.sql
psql -U postgres -d store_management_db -f sql/seed.sql
psql -U postgres -d store_management_db -f sql/migrations.sql
psql -U postgres -d store_management_db -f sql/users.sql
```

### 2. Environment Variables (.env)
```ini
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_NAME=store_management_db
```

### 3. Run Node.js Application
```bash
npm install
npm run dev
```

Server will start on `http://localhost:5000`. You can test all endpoints directly using Postman, Thunder Client, or cURL!
