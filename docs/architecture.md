# HMART Architecture

## Frontend

Framework:

* Next.js
* TypeScript
* Tailwind CSS

Modules:

* Buyer Portal
* Admin Portal
* Delivery Partner Portal

---

## Backend

Framework:

* Node.js
* Express.js
* TypeScript

Responsibilities:

* Authentication
* Product APIs
* Order APIs
* Payment APIs
* Delivery APIs
* Analytics APIs

---

## Database

Provider:

* Supabase

Database:

* PostgreSQL

Main Entities:

* Users
* Roles
* Categories
* Products
* Inventory
* Cart
* Cart Items
* Orders
* Order Items
* Payments
* Delivery Partners
* Deliveries
* Notifications
* Addresses

---

## Storage

* Product Images
* Invoice PDFs
* Delivery Proof Images

Storage Provider:

* Supabase Storage

---

## Authentication

* JWT Access Token
* Refresh Token
* Role Based Access Control

Roles:

* Admin
* Buyer
* Delivery Partner

---

## Integrations

Payments:

* Razorpay

Emails:

* Resend or SendGrid

SMS:

* Twilio

Maps:

* Google Maps

---

## Deployment

Frontend:

* Vercel

Backend:

* Railway or Render

Database:

* Supabase