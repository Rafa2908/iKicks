# iKicks — Database ERD

## 📌 Overview

This document describes the relational database schema for the iKicks e-commerce application.
The ERD is modeled using **Chen Notation** and split into three sections for readability.

> Database: PostgreSQL · Hosted on: Neon · Notation: Chen (ER Diagram)

---

## 🗄 Entities

| Entity | Description |
|---|---|
| `users` | Customer and admin account information |
| `products` | Sneaker catalog with brand, colorway, and category |
| `product_size` | Weak entity — size and stock quantity per product |
| `product_image` | One or more images per product, one marked primary |
| `cart` | Active shopping cart per user (one per user) |
| `cart_items` | Items currently in a user's cart |
| `orders` | Finalized customer orders with shipping snapshot |
| `order_items` | Line items per order referencing a specific size |
| `transactions` | Payment records linked to an order |
| `shipping` | Saved shipping addresses per user |
| `wishlist` | Products saved by a user for later |

---

## 🔗 Relationships

| Entity | Cardinality | Entity | Notes |
|---|---|---|---|
| `users` | 1 — N | `cart` | One active cart per user |
| `users` | 1 — N | `orders` | A user can place many orders |
| `users` | 1 — N | `shipping` | A user can save multiple addresses |
| `users` | 1 — N | `wishlist` | A user can wishlist many products |
| `products` | 1 — N | `product_size` | Each product has multiple sizes (weak entity) |
| `products` | 1 — N | `product_image` | Each product has multiple images |
| `products` | 1 — N | `wishlist` | A product can appear in many wishlists |
| `product_size` | N — N | `cart_items` | A size can be in many carts |
| `product_size` | N — N | `order_items` | A size can appear in many orders |
| `orders` | 1 — N | `order_items` | An order contains multiple line items |
| `orders` | 1 — 1 | `transactions` | Each order has one payment transaction |
| `shipping` | 1 — N | `orders` | An address can be used for multiple orders |

---

## 🔑 Design Decisions

### Snapshot Pattern
`price_at_add` on `cart_items` and `price_at_purchase` on `order_items` store
the price at the time of the action — not a live reference. This ensures historical
accuracy regardless of future price changes.

`total_at_purchase` on `orders` and `total_paid` on `transactions` follow the same rule.

### Derived Values
`cart` does **not** store a `total_price` column. The cart total is always computed:
```sql
SELECT SUM(price_at_add * quantity)
FROM cart_items
WHERE cart_id = $1;
```

### Phone Number Placement
`phone_number` lives on `orders`, not on `users` or `shipping`. A user may ship
to the same address with a different recipient phone number (e.g. gift orders).

### Weak Entity
`product_size` is a weak entity — it cannot exist without a parent `products` row.
Enforced via `ON DELETE CASCADE` and a composite `UNIQUE(product_id, size)` constraint.

### Primary Image
`product_image` uses a partial unique index to enforce one primary image per product:
```sql
CREATE UNIQUE INDEX one_primary_per_product
ON product_image(product_id)
WHERE is_primary = true;
```

### User Roles
| Role | Access |
|---|---|
| `customer` | Browse, cart, checkout, wishlist |
| `admin` | All of the above + product/order management |

Role is enforced via JWT payload — never trusted from the request body.

---

## 📸 ERD Diagrams

### Chen Notation (full diagram)
![ERD Chen](./ikicks_erd_chen.png)

### Section 1 — Users & Cart
![ERD Section 1](./section1_users_cart.png)

### Section 2 — Products & Orders
![ERD Section 2](./section2_products_orders.png)

### Section 3 — Shipping & Wishlist
![ERD Section 3](./section3_shipping_wishlist.png)

---

## 📁 Files in this Folder

```
ERD/
├── README.md                  ← this file
├── ikicks_erd_chen.html       ← full Chen notation ERD (open in browser)
├── ikicks_erd.drawio          ← editable draw.io source file
├── section1_users_cart.png
├── section2_products_orders.png
└── section3_shipping_wishlist.png
```

---

## 📝 Schema Notes

- All primary keys use `SERIAL` (auto-increment)
- All foreign keys use `ON DELETE CASCADE` unless otherwise noted
- Timestamps use `DEFAULT CURRENT_TIMESTAMP`
- Prices use `NUMERIC(7,2)` to avoid floating point precision issues
- Roles are constrained via `CHECK (role IN ('admin', 'customer'))`
- Payment status is constrained via `CHECK (status IN ('pending', 'completed', 'failed', 'refunded'))`

---

*Last updated: May 2026*
