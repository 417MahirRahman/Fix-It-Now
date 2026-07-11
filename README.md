# FixItNow

A backend-only REST API for a home services marketplace connecting **Customers**, **Technicians**, and **Admins**.

## Live Demo

🔗 [Live API](https://your-deployed-url.com) — replace with your deployed link


## Overview

FixItNow lets customers browse services (plumbing, electrical, cleaning, painting, etc.), book qualified technicians, make payments, and leave reviews. Technicians manage their profile, services, availability, and bookings. Admins oversee users, bookings, and service categories.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Auth:** JWT
- **Payments:** Stripe
- **Testing:** Postman

## User Roles

| Role | Capabilities |
|---|---|
| Customer | Browse services, book technicians, pay, track bookings, leave reviews |
| Technician | Manage profile, services, availability, handle bookings |
| Admin | Manage users, view bookings, manage categories |

## Database Schema

| Table | Description |
|---|---|
| Users | Stores user info, credentials, and role (Customer/Technician/Admin) |
| TechnicianProfile | Technician-specific info (bio, experience), linked to Users |
| Category | Service categories (Plumbing, Electrical, Cleaning, etc.) |
| Service | Specific services offered by technicians, with price and category |
| Booking | Job bookings linking a customer, technician, and service |
| Payment | Payment transactions for bookings (Stripe) |
| Review | Customer reviews and ratings for completed bookings |
| Availability | For technician weekly scheduling |


## Booking Status Flow

```
Requested → Accepted → Paid → InProgress → Completed
              ↓
           Declined
```
Customers can cancel any time before `InProgress`.

## API Endpoints

See [API.md](./API.md) for the full endpoint list.

## Getting Started

```bash
git clone https://github.com/417MahirRahman/Fix-It-Now.git
cd FixItNow
npm install
```

Create a `.env` file:
```
DATABASE_URL=postgresql://user:password@localhost:5432/fixitnow
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
APP_URL=http://localhost:3000
```

Run migrations and start the server:
```bash
npx prisma migrate dev
npm run dev
```
