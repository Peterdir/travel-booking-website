# 🔧 Backend Documentation

## 📋 Overview

This is the backend API for the Travel Booking Website built with Node.js, Express, and MongoDB.

## 🏗️ Architecture

The backend follows the **MVC (Model-View-Controller)** pattern with additional service layer:

```
├── Models       → Data structure and database schemas
├── Controllers  → Handle HTTP requests/responses
├── Services     → Business logic
├── Routes       → API endpoints
├── Middlewares  → Request processing (auth, validation)
└── Config       → Configuration files
```

## 🗂️ Directory Structure

```
├── config/
│   └── db.js                    # MongoDB connection
├── controllers/
│   ├── authController.js        # Authentication logic
│   ├── tourController.js        # Tour CRUD operations
│   └── bookingController.js     # Booking operations
├── middlewares/
│   └── authMiddleware.js        # JWT verification & role check
├── models/
│   ├── User.js                  # User schema
│   ├── Tour.js                  # Tour schema
│   └── Booking.js               # Booking schema
├── routes/
│   ├── authRoutes.js            # /api/auth routes
│   ├── TourRoutes.js            # /api/tours routes
│   └── bookingRoutes.js         # /api/bookings routes
├── services/
│   ├── authService.js           # Auth business logic
│   ├── tourService.js           # Tour business logic
│   ├── bookingService.js        # Booking business logic
│   ├── emailService.js          # Email notifications
│   └── paymentService.js        # Payment processing
└── server.js                    # Express app entry point
```

## 📊 Database Models

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (customer/admin),
  createdAt: Date
}
```

### Tour Model
```javascript
{
  title: String,
  description: String,
  price: Number,
  location: String,
  duration: Number,
  maxGroupSize: Number,
  image: String,
  featured: Boolean,
  departureDates: [{
    date: Date,
    availableSeats: Number
  }],
  createdAt: Date
}
```

### Booking Model
```javascript
{
  user: ObjectId (ref: User),
  tour: ObjectId (ref: Tour),
  departureDate: Date,
  numberOfPeople: Number,
  totalPrice: Number,
  status: String (pending/confirmed/cancelled),
  createdAt: Date
}
```

## 🔐 Authentication & Authorization

### JWT Authentication
- **Token Generation**: Upon login/register
- **Token Storage**: Client-side (localStorage)
- **Token Verification**: Via `authMiddleware.protect`

### Middleware Chain
```javascript
// Protected route
router.get('/bookings', authMiddleware.protect, getBookings)

// Admin-only route
router.delete('/tours/:id', authMiddleware.protect, authMiddleware.restrictTo('admin'), deleteTour)
```

### Password Security
- Hashed using **bcrypt.js** with salt rounds
- Never stored in plain text
- Compared during login using `bcrypt.compare()`

## 📡 API Routes

### Authentication Routes (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register new user | ❌ |
| POST | `/login` | Login user | ❌ |

**Register Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Login Request:**
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

### Tour Routes (`/api/tours`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all tours | ❌ |
| GET | `/:id` | Get tour by ID | ❌ |
| POST | `/` | Create tour | ✅ Admin |
| PUT | `/:id` | Update tour | ✅ Admin |
| DELETE | `/:id` | Delete tour | ✅ Admin |

**Create/Update Tour Request:**
```json
{
  "title": "Ha Long Bay Cruise",
  "description": "Explore the beautiful Ha Long Bay...",
  "price": 299,
  "location": "Ha Long, Vietnam",
  "duration": 3,
  "maxGroupSize": 20,
  "image": "https://example.com/halong.jpg",
  "featured": true,
  "departureDates": [
    {
      "date": "2025-01-15",
      "availableSeats": 20
    }
  ]
}
```

### Booking Routes (`/api/bookings`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Create booking | ✅ |
| GET | `/` | Get all bookings | ✅ Admin |
| PUT | `/:id` | Update booking status | ✅ Admin |

**Create Booking Request:**
```json
{
  "tourId": "507f1f77bcf86cd799439011",
  "departureDate": "2025-01-15",
  "numberOfPeople": 2
}
```

## 🔧 Services Layer

### Auth Service
- User registration with password hashing
- Login validation
- JWT token generation

### Tour Service
- CRUD operations for tours
- Filter and search functionality
- Manage departure dates and availability

### Booking Service
- Create bookings
- Update available seats
- Calculate total price
- Status management (pending/confirmed/cancelled)

### Email Service (Placeholder)
- Send booking confirmation emails
- Send cancellation notifications

### Payment Service (Placeholder)
- Process payments
- Handle refunds

## ⚙️ Configuration

### Environment Variables
Create `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/quanlytour
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
```

### Database Connection
```javascript
// config/db.js
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected...');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
```

## 🚀 Running the Backend

### Development Mode
```bash
npm start
```
Uses **nodemon** for auto-restart on file changes.

### Production Mode
```bash
node server.js
```

## 🧪 Testing

### Manual Testing with cURL

**Register User:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

**Get Tours:**
```bash
curl http://localhost:5000/api/tours
```

**Create Tour (Admin):**
```bash
curl -X POST http://localhost:5000/api/tours \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title":"New Tour","price":199,...}'
```

## 🔒 Security Best Practices

✅ **Implemented:**
- Password hashing with bcrypt
- JWT authentication
- Role-based access control
- CORS configuration
- Environment variables for secrets

⚠️ **Recommended Additions:**
- Rate limiting (express-rate-limit)
- Input validation (express-validator)
- Security headers (helmet)
- MongoDB injection prevention
- HTTPS in production

## 🐛 Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## 📈 Future Enhancements

- [ ] Email notifications (nodemailer)
- [ ] Payment integration (Stripe/PayPal)
- [ ] Image upload (multer + cloud storage)
- [ ] Search and pagination
- [ ] Reviews and ratings system
- [ ] Booking history for users
- [ ] Analytics dashboard for admin
- [ ] Automated testing (Jest/Mocha)

## 🆘 Troubleshooting

### MongoDB Connection Error
```bash
# Check if MongoDB is running
# Windows:
net start MongoDB

# Mac/Linux:
sudo systemctl status mongod
```

### JWT Errors
- Ensure `JWT_SECRET` is set in `.env`
- Check token expiration time
- Verify token format in Authorization header

### CORS Issues
- Check CORS configuration in `server.js`
- Ensure frontend origin is allowed

---

**🎯 Backend is production-ready with room for enhancement!**