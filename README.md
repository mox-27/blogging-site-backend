# Blogging Site Backend

A RESTful API backend for a blogging platform built with Express.js, TypeScript, and input validation using Zod.

## Features

- JWT-based Authentication
- Role-based Authorization (Admin/User)
- Blog post management with content sections
- User management (Admin only)
- Input validation using Zod schemas
- TypeScript for type safety

## Prerequisites

- Node.js
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone git@github.com:mox-27/blogging-site-backend.git
cd blogging-site-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
PORT=3000
```

4. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication Routes (`/api/v1/auth`)
- `POST /register` - Register a new user
- `POST /login` - Login user
- `POST /logout` - Logout user

### Blog Routes (`/api/v1/blogs`)
- `GET /` - Get all blogs
- `POST /` - Create a new blog (Protected)
- `GET /:slug` - Get blog by slug
- `PUT /:id` - Update blog (Protected)
- `DELETE /:id` - Delete blog (Protected)

### User Routes (`/api/v1/users`) - Admin Only
- `GET /` - Get all users
- `GET /:id` - Get user by ID
- `DELETE /:id` - Delete user

## Input Validation Schemas

### Register Input
```typescript
{
  name: string,
  username: string,    // 3-20 chars, alphanumeric + underscore
  email: string,       // valid email
  password: string,    // min 6 chars
  role: "Admin" | "User" (optional)
}
```

### Login Input
```typescript
{
  identifier: string,  // email or username (min 3 chars)
  password: string     // min 6 chars
}
```

### Blog Input
```typescript
{
  title: string,       // non-empty
  description?: string, // max 500 chars
  content: string[],   // array of non-empty strings (Can be Rich text)
  bannerImage?: string, // valid URL
  tags?: string[]      // up to 10 tags
}
```

## Authorization

The API uses a two-level authorization system:
- `userProtected`: Ensures the user is authenticated
- `adminProtected`: Ensures the user has admin privileges

## Tech Stack

- Express.js
- TypeScript
- Zod (Input validation)
- MongoDB (mongoose)

## Project Structure

```
src/
├── controllers/     # Route controllers
├── middlewares/    # Auth middlewares
├── routes/         # API routes
├── zod.types.ts    # Input validation schemas
└── index.ts        # Application entry point
```
