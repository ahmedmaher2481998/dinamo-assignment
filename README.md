# E-Commerce Backend API (Dinamo technical assessment)

A robust NestJS-based e-commerce backend API featuring user authentication, product management, vendor management, and shopping cart functionality.

## 🚀 Features

- JWT-based authentication with refresh tokens
- Role-based access control (Users & Vendors)
- Product catalog management
- Vendor management system
- Shopping cart functionality
- MongoDB integration
- Docker support
- Comprehensive API documentation
- Type-safe implementation with TypeScript

## 🛠 Tech Stack

- NestJS
- MongoDB with Mongoose
- TypeScript
- Docker
- JWT Authentication
- Class Validator
- Swagger UI

## 🏗 Architecture

The application follows a modular architecture with the following components:

- Abstract CRUD service for common operations
- JWT authentication with refresh token rotation
- Role-based access control
- MongoDB schemas with validation
- Docker containerization

## 🔧 Installation & Setup

1. Clone the repository:

```bash
git clone https://github.com/ahmedmaher2481998/dinamo-assignment.git
cd dinamo-assignment
```

2. Install dependencies:

```bash
npm install
```

3. Run with Docker:

```bash
docker compose up -d
```

The API will be available at `http://localhost:3000` all end points has a prefix `/api`

## 📝 API Documentation

### Authentication Endpoints

```
POST /api/auth/sign-up         - Register new user
POST /api/auth/sign-in         - User login
POST /api/auth/log-out         - Logout user
POST /api/auth/refresh         - Refresh access token
```

### User Endpoints

```
GET /api/users/profile         - Get user profile
```

### Product Endpoints

```
POST   /api/products          - Create new product
GET    /api/products          - List all products
GET    /api/products/{id}     - Get product details
PUT    /api/products/{id}     - Update product
DELETE /api/products/{id}     - Delete product
PATCH  /api/products/{id}/stock - Update product stock
```

### Vendor Endpoints

```
POST   /api/vendors/register   - Register new vendor
POST   /api/vendors/sign-in    - Vendor login
POST   /api/vendors/logout     - Vendor logout
GET    /api/vendors           - List all vendors
GET    /api/vendors/{id}      - Get vendor details
PUT    /api/vendors/{id}      - Update vendor
GET    /api/vendors/{id}/stats - Get vendor statistics
PUT    /api/vendors/{id}/verify - Verify vendor
```

### Cart Endpoints

```
GET    /api/cart              - Get cart
DELETE /api/cart              - Clear cart
POST   /api/cart/items        - Add item to cart
PUT    /api/cart/items/{productId} - Update cart item
DELETE /api/cart/items/{productId} - Remove cart item
GET    /api/cart/validate     - Validate cart
```

## 🔒 Authentication

The API uses a JWT-based authentication system with refresh tokens:

- Access tokens expire after 15 minutes
- Refresh tokens expire after 7 days
- Refresh token rotation is implemented for security
- Tokens are required for all endpoints except public end points
- Different token scopes for users and vendors

## 🐳 Docker Support

The project includes Docker configuration for easy deployment:

```yaml
services:
  api:
    build: .
    ports:
      - '3000:3000'
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/ecommerce
    depends_on:
      - mongodb

  mongodb:
    image: mongo:latest
    ports:
      - '27017:27017'
    volumes:
      - mongodb_data:/data/db
```

## 💾 Database

- MongoDB is used as the primary database
- Mongoose schemas with validation
- Indexes for optimized queries
- Temporary database for testing

## 📖 API Documentation

Swagger documentation is available at `/docs` when running in development mode.

## 🔐 Environment Variables

Required environment variables:

```
DB_URL=
# crypto.randomBytes(32).toString('hex')
# secret for hashing the refresh token (RT) ,  access token (AT)
JWT_SECRET_RT=
JWT_SECRET_AT=
```

## 👥 Contributing

> the repository doesn't accept Contributing at the moment,but an eye for future update!

## 📄 License

This project is and technical assessment for a job role ,you are free to use this cade as you want .
