# 🌏 Travel Booking Website

A full-stack web application for booking travel tours with admin management system.

## 🚀 Tech Stack

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **CSS3** - Styling with modern gradients

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Bcrypt.js** - Password hashing

## 📋 Features

### Customer Features
- ✅ Browse available tours with filters (location, price, duration)
- ✅ View detailed tour information
- ✅ Book tours with date selection
- ✅ User registration and login
- ✅ Responsive design for all devices

### Admin Features
- ✅ Tour management (Create, Read, Update, Delete)
- ✅ Booking management
- ✅ Update booking status
- ✅ Protected admin routes

## 🛠️ Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB installed and running
- npm or yarn package manager

### 1. Clone the repository
```bash
git clone https://github.com/Peterdir/travel-booking-website.git
cd travel-booking-website/quanlytour
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the `quanlytour` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/quanlytour
JWT_SECRET=your_secret_key_here
```

### 4. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# Windows (if MongoDB is installed as a service)
net start MongoDB

# Mac/Linux
sudo systemctl start mongod
```

## 🚀 Running the Application

### Development Mode

**Option 1: Run Backend and Frontend Separately**

Terminal 1 - Backend:
```bash
npm start
```
Backend runs at: http://localhost:5000

Terminal 2 - Frontend:
```bash
npm run dev
```
Frontend runs at: http://localhost:5173

**Option 2: Run Both Concurrently**
```bash
npm run dev
```
This runs both backend (port 5000) and frontend (port 5173)

### Production Mode
```bash
# Build frontend
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
quanlytour/
├── config/              # Configuration files
│   └── db.js           # Database connection
├── controllers/         # Request handlers
│   ├── authController.js
│   ├── tourController.js
│   └── bookingController.js
├── middlewares/         # Custom middlewares
│   └── authMiddleware.js
├── models/             # Database models
│   ├── User.js
│   ├── Tour.js
│   └── Booking.js
├── routes/             # API routes
│   ├── authRoutes.js
│   ├── tourRoutes.js
│   └── bookingRoutes.js
├── services/           # Business logic
│   ├── authService.js
│   ├── tourService.js
│   └── bookingService.js
├── src/                # Frontend source
│   ├── components/     # Reusable components
│   ├── pages/         # Page components
│   ├── context/       # React context
│   ├── services/      # API services
│   └── App.jsx        # Main app component
├── server.js          # Express server
└── vite.config.js     # Vite configuration
```

## 🔑 Default Admin Setup

After running the application, create an admin account:

1. Register a new user through the UI
2. Access MongoDB and update the user's role:

```javascript
use quanlytour
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Tours
- `GET /api/tours` - Get all tours
- `GET /api/tours/:id` - Get tour by ID
- `POST /api/tours` - Create tour (Admin only)
- `PUT /api/tours/:id` - Update tour (Admin only)
- `DELETE /api/tours/:id` - Delete tour (Admin only)

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get all bookings (Admin only)
- `PUT /api/bookings/:id` - Update booking status (Admin only)

## 🎨 UI Preview

- **Theme**: Purple gradient design
- **Colors**: 
  - Primary: #667eea
  - Secondary: #764ba2
- **Responsive**: Mobile, Tablet, Desktop

## 📝 License

MIT License

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support, email support@travelbooking.com or open an issue in the repository.

---

**Made with ❤️ by Peterdir**
