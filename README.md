# doctor-backend

A Node.js backend application for a doctor appointment system with image upload to Cloudinary.

## Features

- Doctor management (Add, Update, Delete)
- Image upload to Cloudinary
- MongoDB database integration
- RESTful API endpoints
- Secure password hashing with bcrypt
- File upload handling with multer

## Prerequisites

- Node.js (v14 or higher)
- MongoDB account
- Cloudinary account

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

3. Create a `.env` file in the root directory and add your credentials:
```bash
cp .env.example .env
```

Then edit `.env` with your actual credentials:
```
MONGODB_URI=your_mongodb_connection_string
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
PORT=5000
```

## Running the Application

Development mode with nodemon:
```bash
npm run dev
```

Or use nodemon directly:
```bash
nodemon server.js
```

Production mode:
```bash
npm start
```

## API Endpoints

### Admin Routes
- `POST /api/admin/add-doctor` - Add a new doctor (requires image upload)

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
