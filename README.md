# 🛒 E-Commerce API (NestJS + Prisma + Redis + Bull)

<div align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
  <br />
  <p>
    A highly scalable, robust, and feature-rich E-Commerce RESTful API built with
    <strong>NestJS</strong>, <strong>TypeScript</strong>, and
    <strong>Prisma ORM</strong> using an event-driven and queue-based architecture.
  </p>
</div>

---

## 🚀 Key Features

### 🛍️ Core E-Commerce

- **Products & Categories**: Full product catalog management, category nesting, and bookmark/wishlist functionalities.
- **Cart & Orders**: Nested transaction-based order creation, basket item management, and total price calculation.
- **Zibal Payment Gateway**: Fully integrated Zibal payment gateway with automated verification, security checks against price tampering, and transaction tracking.

### 🔐 Authentication & Security

- **JWT & Role-Based Access Control (RBAC)**: Secure authentication combined with a highly advanced permission system combining User Roles and Direct User Permissions via raw SQL queries.
- **Rate Limiting & IP Blocking**: Custom Redis-backed IP tracker middleware to limit requests and auto-block malicious IPs.

### 📨 Background Jobs & Notifications

- **SMS System with Bull Queue**: Efficient, non-blocking bulk SMS delivery using `Redis` and `@nestjs/bull` queues with automatic retry strategies.
- **Event-Driven Architecture**: Uses `@nestjs/event-emitter` to decouple operations like sending SMS notifications after an order is updated or placed.

### 🎫 User Interaction & Support

- **Support Tickets**: Multi-level ticketing system with reply capabilities and restrictions on deep-nested replies.
- **Comments System**: Product reviews and scoring systems.

### ⚡ Performance & Caching

- **Redis Caching**: Cached heavy queries like the product list, boosting API read speeds.

---

## 🛠 Tech Stack

- **Framework**: NestJS
- **Database ORM**: Prisma
- **Database Engine**: MySQL
- **Caching & Queues**: Redis & Bull
- **HTTP Client**: Axios (`@nestjs/axios`) for payment gateway requests
- **Task Scheduling**: `@nestjs/schedule`
- **Events**: `@nestjs/event-emitter`

---

## 📋 Prerequisites

Ensure you have the following installed on your local machine:

- [Node.js](https://nodejs.org/en/) v16 or higher
- [Redis Server](https://redis.io/) running on `localhost:6379`
- MySQL or PostgreSQL Server

---

## ⚙️ Installation & Setup

1. **Clone the repository:**

```bash
   git clone https://github.com/shayan-alizadeh/E-commerce.git
   cd e-commerce-api
```

2. **Install dependencies:**

```bash
   npm install
```

3. **Configure Environment Variables:Create a .env file in the root directory and add your database credentials:**

```bash
DATABASE_URL="mysql://root:password@localhost:3306/database_name"

DATABASE_HOST=localhost
DATABASE_USER=root
DATABASE_PASSWORD=password
DATABASE_NAME=e_commerce

JWT_SECRET_KEY=your_jwt_secret_key
JWT_EXPIRATION=1h
IS_PUBLIC_KEY=your_public_key

ZIBAL_MERCHANT=your_zibal_merchant
PAYMENT_CALLBACK_URL=http://localhost:3000/payment/verify
```

4. **Run the Application:**

```bash
   npm start
   # or using nodemon for development
   npm run dev
```
