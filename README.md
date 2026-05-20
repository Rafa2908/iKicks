# iKicks 👟

> Full-stack sneaker e-commerce platform built with Node.js, Express, PostgreSQL, and React.

![iKicks Banner](./docs/screenshots/banner.png)

---

## 📌 Overview

iKicks is a full-stack sneaker store where users can browse, filter, and purchase sneakers with a seamless checkout experience. Built with a focus on clean architecture, relational data modeling, and secure authentication.

**What users can do:**

- Browse and filter sneakers by brand, size, colorway, and category
- View product details with multiple images
- Add items to cart by size
- Checkout securely via Stripe
- Save addresses and track orders
- Wishlist products for later

**What admins can do:**

- Add, update, and delete products
- Manage inventory per size
- View and manage all orders
- Access a protected admin dashboard

---

## 🚀 Features

### ✅ Implemented

- [x] JWT authentication (register, login, role-based access)
- [x] Admin middleware — role verified from token, not request body
- [x] PostgreSQL schema — 11 tables, fully normalized
- [x] Cart logic — add, update, remove items by size
- [x] Order placement with database transactions
- [x] Price snapshot on cart and order items
- [x] Shipping address management
- [x] Wishlist

### 🔄 In Progress

- [ ] React frontend
- [ ] Stripe payment integration
- [ ] Product image upload (Cloudinary)
- [ ] Admin dashboard UI

### 📋 Planned

- [ ] Search and filtering
- [ ] Order history page
- [ ] Email notifications
- [ ] Analytics dashboard

---

## 📸 Screenshots

### Product Listing

![Product Listing](./docs/screenshots/product_listing.png)

### Product Detail

![Product Detail](./docs/screenshots/product_detail.png)

### Shopping Cart

![Cart](./docs/screenshots/cart.png)

### Checkout

![Checkout](./docs/screenshots/checkout.png)

### Admin Dashboard

![Admin](./docs/screenshots/admin_dashboard.png)

---

## 🛠 Tech Stack

| Layer     | Technology                              |
| --------- | --------------------------------------- |
| Frontend  | React, React Router, Axios, TailwindCSS |
| Backend   | Node.js, Express.js                     |
| Database  | PostgreSQL (hosted on Neon)             |
| Auth      | JWT + bcrypt                            |
| Payments  | Stripe                                  |
| Media     | Cloudinary                              |
| Dev Tools | Postman, draw.io, dbdiagram.io          |

---

## 🗄 Database

iKicks uses a fully normalized PostgreSQL schema with 11 tables.

**Key design decisions:**

- Snapshot pattern — prices stored at time of cart add and purchase
- Weak entity — `product_size` depends on `products`
- Role enforcement via JWT payload, not request body
- Database transactions for order placement

📂 See [`/docs/erd/README.md`](./docs/erd/README.md) for full schema documentation and diagrams.

![ERD Preview](./docs/erd/section2_products_orders.png)

---

## 🔌 API Reference

Base URL: `http://localhost:3000/api`

### Auth

| Method | Endpoint         | Auth | Description        |
| ------ | ---------------- | ---- | ------------------ |
| POST   | `/auth/register` | —    | Create account     |
| POST   | `/auth/login`    | —    | Login, receive JWT |

### Products

| Method | Endpoint        | Auth     | Description       |
| ------ | --------------- | -------- | ----------------- |
| GET    | `/products`     | —        | Get all products  |
| GET    | `/products/:id` | —        | Get product by ID |
| POST   | `/products`     | 🔒 Admin | Add a product     |
| PUT    | `/products/:id` | 🔒 Admin | Update product    |
| DELETE | `/products/:id` | 🔒 Admin | Delete product    |

### Cart

| Method | Endpoint    | Auth | Description          |
| ------ | ----------- | ---- | -------------------- |
| GET    | `/cart`     | ✅   | Get user's cart      |
| POST   | `/cart`     | ✅   | Add item to cart     |
| PUT    | `/cart/:id` | ✅   | Update item quantity |
| DELETE | `/cart/:id` | ✅   | Remove item          |

### Orders

| Method | Endpoint        | Auth     | Description       |
| ------ | --------------- | -------- | ----------------- |
| POST   | `/orders`       | ✅       | Place an order    |
| GET    | `/orders`       | ✅       | Get user's orders |
| GET    | `/admin/orders` | 🔒 Admin | Get all orders    |

---

## 📂 Project Structure

```bash
ikicks/
│
├── client/                   # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── utils/
│   └── package.json
│
├── server/                   # Express backend
│   ├── controllers/          # Route logic
│   ├── middleware/           # auth, admin, error handler
│   ├── routes/               # Express routers
│   ├── db/                   # Pool config + schema SQL
│   ├── utils/                # Regex validators, helpers
│   ├── .env                  # Environment variables (gitignored)
│   ├── .env.example
│   └── index.js
│
├── docs/
│   ├── erd/                  # ERD diagrams + README
│   ├── api/                  # API documentation
│   └── screenshots/          # App screenshots
│
├── .gitignore
├── README.md
└── package.json
```

---

## ⚙️ Setup & Run

### Prerequisites

- Node.js v18+
- PostgreSQL or a [Neon](https://neon.tech) account

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/ikicks.git
cd ikicks
```

### 2. Configure environment

```bash
cd server
cp .env.example .env
```

Fill in your `.env`:

```env
PORT=3000
DBURL=your_neon_connection_string
JWT_SECRET=your_secret_key
STRIPE_SECRET_KEY=your_stripe_key
```

### 3. Set up the database

```bash
psql -U postgres -f ./server/db/schema.sql
```

### 4. Install and run

```bash
# Backend
cd server && npm install && npm run dev

# Frontend (separate terminal)
cd client && npm install && npm run dev
```

---

## 🌱 Environment Variables

| Variable            | Description                   |
| ------------------- | ----------------------------- |
| `PORT`              | Server port (default 3000)    |
| `DBURL`             | PostgreSQL connection string  |
| `JWT_SECRET`        | Secret key for signing tokens |
| `STRIPE_SECRET_KEY` | Stripe secret key             |
| `CLOUDINARY_URL`    | Cloudinary media URL          |

---

## 👤 Author

**Jose Calderon**

- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [linkedin.com/in/yourprofile](https://linkedin.com/in/yourprofile)

---

_Built as part of a summer full-stack development sprint — May 2026_
