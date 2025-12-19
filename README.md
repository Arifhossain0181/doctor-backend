# Doctor Appointment System Backend

A RESTful API backend for managing doctor appointments with user authentication, admin controls, and cloud image storage.

## Features

**Admin Panel**
- Add, update, and delete doctors
- View all appointments
- Dashboard management

**Doctor Management**
- Doctor profile with speciality, fees, and availability
- Appointment scheduling system
- Change availability status

**User Features**
- User registration and login with JWT authentication
- Book appointments with doctors
- View and cancel appointments
- Profile management with image upload

**Technical Features**
- MongoDB database integration
- Cloudinary image storage
- JWT token-based authentication
- Password hashing with bcrypt
- File upload handling with multer
- Input validation

## Tech Stack

- Node.js & Express.js
- MongoDB with Mongoose
- Cloudinary for image storage
- JWT for authentication
- Bcrypt for password security

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Arifhossain0181/doctor-backend.git
cd doctor-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the following variables:
```
MONGODB_URI=your_mongodb_connection_string
DB_USER=your_db_username
DB_PASSWORD=your_db_password
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_admin_password
JWT_SECRET=your_jwt_secret
PORT=5000
```

## Running the Application

Start development server:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

**Admin Routes** (`/api/admin`)
- POST `/add-doctor` - Add new doctor
- POST `/login` - Admin login
- GET `/all-doctors` - Get all doctors
- POST `/change-availability` - Update doctor availability
- GET `/appointments` - View all appointments
- POST `/cancel-appointments` - Cancel appointment

**Doctor Routes** (`/api/doctor`)
- GET `/list` - Get all available doctors

**User Routes** (`/api/user`)
- POST `/register` - User registration
- POST `/login` - User login
- GET `/get-profile` - Get user profile
- POST `/update-profile` - Update profile with image
- POST `/book-appointment` - Book an appointment
- GET `/appointments` - Get user appointments
- POST `/cancel-appointment` - Cancel appointment

## Project Structure

```
Backend/
├── config/           # Database and Cloudinary configuration
├── Controller/       # Route controllers
├── Middleware/       # Authentication and file upload middleware
├── Models/          # MongoDB schemas
├── Routes/          # API routes
├── uploads/         # Temporary file uploads
├── server.js        # Application entry point
└── .env             # Environment variables
```

## Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:
```
Authorization: Bearer <token>
```

## License

ISC

## Environment Variables

See `.env.example` for required environment variables.

## Tech Stack

- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Cloudinary** - Image hosting
- **Multer** - File upload middleware
- **Bcrypt** - Password hashing
- **Validator** - Input validation
- **JWT** - Authentication tokens

## License

ISC
