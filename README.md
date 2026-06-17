# iKicks

> Full-stack sneaker e-commerce platform built with Node.js, Express, PostgreSQL, and React.

---

## Overview

iKicks is a full-stack sneaker store where users can browse, filter, and purchase sneakers. Built with clean architecture, relational data modeling, JWT-based auth, and Stripe payments.

**What users can do:**

- Browse and filter sneakers by brand, size, colorway, and category
- View product details with multiple images
- Add items to cart by size
- Save and select shipping addresses at checkout
- Pay via Stripe (credit card), bank transfer, or cash reservation
- Wishlist products for later
- View order history

**What admins can do:**

- Add, update, and delete products
- Manage inventory per size
- View and manage all orders
- Access a protected admin dashboard

---

## Features

### Implemented

- JWT authentication — register, login, logout, role-based access (user / admin)
- Admin middleware — role verified from token, not request body
- PostgreSQL schema — 11 tables, fully normalized
- Cart — add, increase/decrease quantity, remove items by size; price snapshot on add
- Order placement — database transactions, inventory decremented atomically
- Price snapshot — `price_at_add` on cart items, `price_at_purchase` on order items
- Stripe credit card payments — `PaymentIntent` flow using `@stripe/react-stripe-js` `CardElement`
- Shipping addresses — save, list, update, delete; duplicate detection on the server
- Saved address selection at checkout — users can pick an existing address or enter a new one without re-submitting duplicates
- Wishlist
- Password reset flow — email OTP via Resend
- Product image upload — Cloudinary
- Admin dashboard UI

### In Progress / Planned

- Order confirmation page (component exists, route commented out)
- Search and text filtering
- Analytics dashboard

---

## Tech Stack

| Layer     | Technology                                        |
| --------- | ------------------------------------------------- |
| Frontend  | React 18, React Router v6, Axios, Vite            |
| Payments  | Stripe (`@stripe/react-stripe-js`, `stripe` npm)  |
| Backend   | Node.js, Express.js                               |
| Database  | PostgreSQL (hosted on Neon)                       |
| Auth      | JWT + bcrypt, HTTP-only cookies                   |
| Media     | Cloudinary                                        |
| Email     | Resend / Nodemailer + React Email templates       |
| Dev Tools | Postman, draw.io, dbdiagram.io                    |

---

## Database

PostgreSQL schema — 11 tables, fully normalized.

**Key design decisions:**

- Snapshot pattern — prices stored at time of cart add (`price_at_add`) and at purchase (`price_at_purchase`)
- Weak entity — `product_size` depends on `products`
- Role enforcement via JWT payload, not request body
- Database transactions for order placement — inventory decremented and order items inserted atomically
- Cascade deletes throughout (cart deleted → cart_items deleted, etc.)
- Duplicate address detection on the server — re-submitting an existing address returns its existing ID

See [`/docs/erd/ERD_README.md`](./docs/erd/ERD_README.md) for full schema and diagrams.

---

## Checkout Flow

```
/delivery  →  Select saved address or enter new one
           →  Recipient name + phone collected here
/payment   →  Choose method: Credit Card | Bank Transfer | Cash
           →  Credit card: Stripe CardElement → PaymentIntent confirmed client-side
           →  Stripe webhook (server-to-server) updates order status + sends confirmation email
```

---

## API Reference

Base URL: `http://localhost:8000`

### Auth (`/user`)

| Method | Endpoint                | Auth     | Description              |
| ------ | ----------------------- | -------- | ------------------------ |
| POST   | `/user/register`        | —        | Create account           |
| POST   | `/user/login`           | —        | Login, receive JWT cookie|
| POST   | `/user/logout`          | —        | Clear auth cookie        |
| GET    | `/user/me`              | ✅       | Get current user         |
| GET    | `/user/profile`         | ✅       | Get profile data         |
| PUT    | `/user/profile`         | ✅       | Update profile           |
| POST   | `/user/auth/get-code`   | —        | Send password reset OTP  |
| POST   | `/user/auth/verify-code`| —        | Verify reset OTP         |
| POST   | `/user/auth/reset`      | —        | Set new password         |
| GET    | `/user/admin`           | 🔒 Admin | List all users           |

### Products (`/product`)

| Method | Endpoint                     | Auth     | Description          |
| ------ | ---------------------------- | -------- | -------------------- |
| GET    | `/product/preview`           | —        | All products preview |
| GET    | `/product/info`              | —        | Full product info    |
| GET    | `/product/details/:productId`| —        | Single product       |
| GET    | `/product/filter`            | —        | Filter products      |
| POST   | `/product/add`               | 🔒 Admin | Add a product        |
| PUT    | `/product/update/item`       | 🔒 Admin | Update product       |
| PUT    | `/product/update/price`      | 🔒 Admin | Update price         |
| PUT    | `/product/update/quantity`   | 🔒 Admin | Update stock         |

### Cart (`/cart`)

| Method | Endpoint          | Auth | Description             |
| ------ | ----------------- | ---- | ----------------------- |
| GET    | `/cart/preview`   | ✅   | Get cart items          |
| GET    | `/cart/count`     | ✅   | Get cart item count     |
| POST   | `/cart/add`       | ✅   | Add item by size        |
| PUT    | `/cart/increase`  | ✅   | Increase item quantity  |
| PUT    | `/cart/decrease`  | ✅   | Decrease item quantity  |
| DELETE | `/cart/delete`    | ✅   | Remove item             |
| DELETE | `/cart/clear`     | ✅   | Clear entire cart       |

### Orders (`/order`)

| Method | Endpoint                      | Auth | Description        |
| ------ | ----------------------------- | ---- | ------------------ |
| POST   | `/order/place`                | ✅   | Place an order     |
| GET    | `/order/preview`              | ✅   | Order list preview |
| GET    | `/order/details/:shippingId`  | ✅   | Order detail       |

### Payments (`/payment`)

| Method | Endpoint           | Auth | Description                       |
| ------ | ------------------ | ---- | --------------------------------- |
| POST   | `/payment/process` | ✅   | Create Stripe PaymentIntent       |
| POST   | `/webhook`         | —    | Stripe webhook (server-to-server) |

### Shipping (`/shipping`)

| Method | Endpoint              | Auth | Description             |
| ------ | --------------------- | ---- | ----------------------- |
| GET    | `/shipping/addresses` | ✅   | List saved addresses    |
| POST   | `/shipping/add`       | ✅   | Add shipping address    |
| PUT    | `/shipping/update`    | ✅   | Update address          |
| DELETE | `/shipping/delete`    | ✅   | Delete address          |

---

## Project Structure

```
iKicks/
├── client/                         # React + Vite frontend
│   └── src/
│       ├── components/
│       │   ├── above-nav/          # Top info bar
│       │   ├── auth/               # Login + Registration forms
│       │   ├── below-nav/          # Category navigation bar
│       │   ├── admin/              # Admin dashboard + product forms
│       │   ├── cart/
│       │   ├── delivery/           # Address selection + new address form
│       │   ├── navbar/
│       │   ├── order-confirmation/ # (pending route)
│       │   ├── orders/
│       │   ├── payment/            # Stripe CardElement checkout
│       │   ├── products/
│       │   ├── sneaker-by-brand/
│       │   ├── sneaker-display/
│       │   └── ...
│       ├── context/                # CartContext, UserContext, ToastContext
│       └── service/                # Axios instances per domain
│
├── server/                         # Express backend
│   ├── controllers/                # Business logic per domain
│   ├── middleware/                 # auth.js (JWT), admin.js (role check)
│   ├── routes/                     # Thin Express routers
│   ├── config/                     # PostgreSQL pool (Neon)
│   ├── emails/                     # React Email templates via Resend
│   ├── utils/                      # Regex validators, rate limiters
│   └── server.js
│
└── docs/
    └── erd/                        # ERD diagrams + schema docs
```

---

## Setup & Run

### Prerequisites

- Node.js v18+
- A [Neon](https://neon.tech) PostgreSQL database
- A Stripe account (test keys)
- A Resend account (email)
- A Cloudinary account (images)

### 1. Clone

```bash
git clone https://github.com/yourusername/ikicks.git
cd ikicks/iKicks
```

### 2. Configure server environment

```bash
cd server
cp .env.example .env   # create this file if it doesn't exist
```

Required variables in `server/.env`:

| Variable               | Description                              |
| ---------------------- | ---------------------------------------- |
| `PORT`                 | Server port (default 8000)               |
| `DBURL`                | Neon PostgreSQL connection string        |
| `JWT_SECRET`           | Secret for signing tokens                |
| `STRIPE_SECRET_KEY`    | Stripe secret key                        |
| `STRIPE_WEBHOOK_SECRET`| Stripe webhook signing secret            |
| `RESEND_KEY`           | Resend API key for emails                |
| `CLOUDINARY_NAME`      | Cloudinary cloud name                    |
| `CLOUDINARY_API_KEY`   | Cloudinary API key                       |
| `CLOUDINARY_API_SECRET`| Cloudinary API secret                    |
| `FRONTEND_URL`         | Client origin for CORS (e.g. http://localhost:5173) |

### 3. Configure client environment

Create `client/.env.local`:

```env
VITE_BACKEND_URL=http://localhost:8000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 4. Install and run

```bash
# Backend
cd server && npm install && npm run dev

# Frontend (separate terminal)
cd client && npm install && npm run dev
```

---

## Author

**Jose Calderon**

---

_Built — 2026_
