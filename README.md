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

- **Framework**: [NestJS](https://nestjs.com/)
- **Database ORM**: [Prisma](https://www.prisma.io/)
- **Database Engine**: MySQL
- **Caching & Queues**: [Redis](https://redis.io/) & [Bull](https://docs.nestjs.com/techniques/queues)
- **HTTP Client**: Axios (`@nestjs/axios`) for payment gateway requests
- **Task Scheduling**: `@nestjs/schedule`
- **Events**: `@nestjs/event-emitter`

---

## 📋 Prerequisites

Ensure you have the following installed on your local machine:

- [Node.js](https://nodejs.org/en/) v16 or higher
- [Redis Server](https://redis.io/) running on `localhost:6379`
- MariaDB or PostgreSQL Server

---

## ⚙️ Installation

### 1. Clone the Repository
