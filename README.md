# 🔨 BidZone - MERN Bidding Application

A full-stack real-time bidding platform built with MongoDB, Express.js, React.js, and Node.js.

---

## Features

- JWT Authentication with role-based access (Admin / User)
- Real-time bidding with Socket.io
- Product listings with image uploads
- Bid history tracking
- Notification system (win alerts)
- Mock payment flow
- Admin dashboard (users, products, bids)

---

## Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- npm or yarn

---

## Setup Instructions

### 1. Clone / Navigate to project

```bash
cd bidding-app
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Copy and configure environment variables:
```bash
# .env is already created, edit if needed:
# MONGO_URI=mongodb://localhost:27017/bidding-app
# JWT_SECRET=your_secret_here
# CLIENT_URL=http://localhost:5173
# PORT=5000
```

Create the uploads directory (already done):
```bash
mkdir uploads
```

Seed the database with test data:
```bash
node seed.js
```

Start the backend server:
```bash
npm run dev     # development (nodemon)
# or
npm start       # production
```

Backend runs on: http://localhost:5000

---

### 3. Frontend Setup

Open a new terminal:
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: http://localhost:5173

---

## Test Accounts

| Role  | Email                  | Password    |
|-------|------------------------|-------------|
| Admin | admin@bidzone.com      | admin123    |
| User  | alice@example.com      | password123 |
| User  | bob@example.com        | password123 |

---

## API Routes

### Auth
| Method | Route              | Description        | Auth |
|--------|--------------------|--------------------|------|
| POST   | /api/auth/register | Register user      | No   |
| POST   | /api/auth/login    | Login              | No   |
| GET    | /api/auth/me       | Get current user   | Yes  |

### Products
| Method | Route                    | Description          | Auth     |
|--------|--------------------------|----------------------|----------|
| GET    | /api/products            | List active products | No       |
| GET    | /api/products/:id        | Get product detail   | No       |
| POST   | /api/products            | Create product       | Yes      |
| GET    | /api/products/mine       | My products          | Yes      |
| PUT    | /api/products/:id/stop   | Stop bidding         | Owner    |
| DELETE | /api/products/:id        | Delete product       | Owner/Admin |

### Bids
| Method | Route                       | Description      | Auth  |
|--------|-----------------------------|------------------|-------|
| POST   | /api/bids/:productId        | Place a bid      | Yes   |
| GET    | /api/bids/:productId/history| Bid history      | No    |

### Notifications
| Method | Route                   | Description           | Auth |
|--------|-------------------------|-----------------------|------|
| GET    | /api/notifications      | Get my notifications  | Yes  |
| PUT    | /api/notifications/read | Mark all as read      | Yes  |

### Payment
| Method | Route                   | Description       | Auth |
|--------|-------------------------|-------------------|------|
| POST   | /api/payment/:productId | Process payment   | Yes  |
| GET    | /api/payment/:productId | Get payment status| Yes  |

### Admin (Admin only)
| Method | Route              | Description      |
|--------|--------------------|------------------|
| GET    | /api/admin/users   | All users        |
| GET    | /api/admin/products| All products     |
| GET    | /api/admin/bids    | All bids         |
| DELETE | /api/admin/users/:id| Delete user     |

---

## Project Structure

```
bidding-app/
├── backend/
│   ├── config/db.js              # MongoDB connection
│   ├── controllers/              # Business logic
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── bidController.js
│   │   ├── notificationController.js
│   │   └── paymentController.js
│   ├── middleware/auth.js        # JWT + role middleware
│   ├── models/                   # Mongoose schemas
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Bid.js
│   │   ├── Notification.js
│   │   └── Payment.js
│   ├── routes/                   # Express routers
│   ├── socket/socketHandler.js   # Socket.io events
│   ├── uploads/                  # Uploaded images
│   ├── seed.js                   # Test data seeder
│   └── server.js                 # Entry point
└── frontend/
    └── src/
        ├── api/axios.js          # Axios with JWT interceptor
        ├── components/           # Reusable UI components
        ├── context/              # React Context (Auth, Socket)
        └── pages/                # Route pages
```

---

## How Bidding Works

1. User creates a product listing with a starting bid
2. Other users place bids (must be higher than current bid)
3. Socket.io broadcasts new bids in real-time to all viewers
4. Product owner clicks "Stop Bidding" to end the auction
5. System selects the highest bidder as winner
6. Winner receives a notification: "You won this product!"
7. Winner proceeds to mock payment page

---

## Tech Stack

- **Frontend**: React 18, React Router v6, Vite, Socket.io-client
- **Backend**: Node.js, Express.js, Socket.io
- **Database**: MongoDB with Mongoose
- **Auth**: JWT + bcryptjs
- **File Upload**: Multer
