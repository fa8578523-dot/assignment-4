# Part 2: Relational Schema Mapping

Design a schema (Mapping) for the ERD (User, User_Phone, Product, Own Relationship).

---

## 1. Schema Representation (Relational Model)

```text
User ( id [PK], firstName, lastName, email, password, role )

User_Phone ( userId [FK], phone )
   - Primary Key: (userId, phone)
   - Foreign Key: userId REFERENCES User(id) ON DELETE CASCADE

Product ( id [PK], name, stock, price, isDeleted, userId [FK] )
   - Foreign Key: userId REFERENCES User(id) ON DELETE SET NULL
```

---

## 2. Mapping Explanation & Steps

### Step 1: Mapping Strong Entities & Composite Attributes
- **`User` Entity**: The composite attribute `userName` is expanded into two separate attributes: `firstName` and `lastName`. `id` becomes the Primary Key.
- **`Product` Entity**: Mapped into the `Product` table with `id` as the Primary Key and fields `name`, `stock`, `price`, `isDeleted`.

### Step 2: Mapping Multi-valued Attribute (`phone`)
- The multi-valued attribute `phone` (Double Oval) is mapped into a separate relation **`User_Phone`**.
- Primary Key is composite `(userId, phone)` where `userId` is a Foreign Key referencing `User(id)`.

### Step 3: Mapping 1:N Relationship (`Own`)
- Relationship `User (1) ── Own ── (N) Product`:
- The primary key of the 1-side (`User.id`) is inserted as a Foreign Key **`userId`** into the N-side (`Product` table).

---

## 3. SQL Database Definition (DDL)

```sql
-- 1. Create User Table
CREATE TABLE "User" (
    id SERIAL PRIMARY KEY,
    firstName VARCHAR(100) NOT NULL,
    lastName VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user'
);

-- 2. Create User_Phone Table (Multi-valued Attribute Mapping)
CREATE TABLE "User_Phone" (
    userId INT NOT NULL,
    phone VARCHAR(30) NOT NULL,
    PRIMARY KEY (userId, phone),
    FOREIGN KEY (userId) REFERENCES "User"(id) ON DELETE CASCADE
);

-- 3. Create Product Table (1:N Relationship Mapping with userId FK)
CREATE TABLE "Product" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    isDeleted BOOLEAN NOT NULL DEFAULT FALSE,
    userId INT REFERENCES "User"(id) ON DELETE SET NULL
);
```
