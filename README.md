# Blogging Site Backend

A RESTful API backend for a blogging platform built with Express.js, TypeScript, and input validation using Zod.

## Features

- JWT-based Authentication
- Role-based Authorization (Admin/User)
- Blog post management with rich content blocks
- Image upload support (Cloudinary)
- User management (Admin only)
- Input validation using Zod schemas
- TypeScript for type safety

## Prerequisites

- Node.js
- npm or yarn
- Cloudinary account

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
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_APIKEY=your_cloudinary_api_key
CLOUD_SECRET=your_cloudinary_api_secret
JWT_SECRET=your_jwt_secret
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
  content: Array<{
    type: 'text' | 'image' | 'heading' | 'quote',
    content: string,
    src?: string,     // required for image type
    level?: number    // required for heading type (1-6)
  }>,
  bannerImage?: string, // valid URL or file upload
  tags?: string[]      // up to 10 tags
}
```

### Content Block Examples
```json
{
  "content": [
    {
      "type": "heading",
      "content": "Introduction",
      "level": 1
    },
    {
      "type": "text",
      "content": "This is a paragraph..."
    },
    {
      "type": "image",
      "content": "Image caption",
      "src": "https://example.com/image.jpg"
    },
    {
      "type": "quote",
      "content": "This is a quote"
    }
  ]
}
```

## Image Upload

The API supports two ways to upload images:
1. Direct file upload using multipart/form-data
2. URL-based upload where the API will fetch and store the image

Images are stored on Cloudinary and the API returns secure URLs.

## Authorization

The API uses a two-level authorization system:
- `userProtected`: Ensures the user is authenticated
- `adminProtected`: Ensures the user has admin privileges

## Tech Stack

- Express.js
- TypeScript
- Zod (Input validation)
- MongoDB (mongoose)
- Cloudinary (Image hosting)
- JWT (Authentication)

## Project Structure

```
src/
├── config/        # Configuration files
├── controllers/   # Route controllers
├── middlewares/   # Auth middlewares
├── models/        # MongoDB models
├── routes/        # API routes
├── utils/         # Helper functions
├── zod.types.ts   # Input validation schemas
└── index.ts       # Application entry point
```
