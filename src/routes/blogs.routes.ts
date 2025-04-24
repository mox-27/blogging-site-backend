import express from 'express';
import {
    createBlog, deleteBlog, getAllBlogs, getBlogBySlug, updateBlog
} from '../controllers/blogs.controller';
import { userProtected } from '../middlewares/auth.middleware';
const router = express.Router();

//Get All Blogs
router.get('/', getAllBlogs);

//Create a new Blog
router.post('/', userProtected, createBlog);

//Get a single Blog by slug
router.get('/:slug', getBlogBySlug);

//Update a Blog
router.put('/:id', userProtected, updateBlog);

//Delete a Blog
router.delete('/:id', userProtected, deleteBlog);

export default router;