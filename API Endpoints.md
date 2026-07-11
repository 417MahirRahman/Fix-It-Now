# FixItNow API Endpoints

Base URL: `http://localhost:5000/api`

## Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/users | Register new user (customer/technician/admin) |
| POST | /api/auth/login | Login user, return JWT |
| GET | /api/users/me | Get current authenticated user's profile |

## Services & Technicians (Public)

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/services | Get all services with filters (type, rating) |
| GET | /api/technicians | Get all technicians with filters (type, location, rating) |
| GET | /api/technicians/:id | Get technician profile with reviews |
| GET | /api/categories | Get all service categories |

## Bookings

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/bookings | Create new booking (customer) |
| GET | /api/bookings | Get user's bookings |
| GET | /api/bookings/:id | Get booking details |

## Payments (Stripe)

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/payments/create | Create a payment session for an accepted booking |
| POST | /api/payments/confirm | Confirm/verify payment using session ID |
| GET | /api/payments | Get user's payment history |
| GET | /api/payments/:id | Get payment details |

## Technician Management

| Method | Endpoint | Description |
|---|---|---|
| PUT | /api/technician/profile | Update technician profile |
| POST | /api/technician/services | Create a new service |
| PUT | /api/technician/services/:id | Update an existing service |
| POST | /api/technician/availability | Add an availability slot |
| PUT | /api/technician/availability/:id | Update an existing availability slot |
| GET | /api/technician/bookings | Get technician's bookings |
| PATCH | /api/technician/bookings/:id | Update booking status (accept/decline/complete) |

## Reviews

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/reviews | Create review (after job completion) |

## Admin

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/admin/users | Get all users |
| PATCH | /api/admin/users/:id | Update user status (ban/unban) |
| GET | /api/admin/bookings | Get all bookings |
| GET | /api/admin/categories | Get all categories |
| POST | /api/admin/categories | Create new service category |
