import { Request, Response } from "express";
import blogModel from "../models/blog.models";
import { blogInputSchema } from "../zod.types";
import { createSlug, handleImageUpload } from "../utils";
import { IRequest } from "../middlewares/auth.middleware";

type ApiResponse<T = any> = {
    status: "success" | "error";
    message: string;
    data?: T;
    error?: any;
};



export const getAllBlogs = async (req: Request, res: Response<ApiResponse>) => {
    try {
        const blogs = await blogModel.find({ isPublished: true }).lean();
        res.json({
            status: "success",
            message: "Blogs fetched successfully",
            data: blogs
        });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Internal server error"
        });
        return;
    }
};

export const createBlog = async (req: IRequest, res: Response<ApiResponse>) => {
    try {
        const body = blogInputSchema.safeParse(req.body);
        if (!body.success) {
            res.status(400).json({
                status: "error",
                message: "Invalid input",
                error: body.error.flatten()
            });
            return;
        }

        const { title, description, content, tags, bannerImage } = body.data;
        const slug = createSlug(title);

        // Check for existing blog
        const existingBlog = await blogModel.findOne({ slug }).lean();
        if (existingBlog) {
            res.status(409).json({
                status: "error",
                message: "Blog with same title already exists"
            });
            return;
        }

        // Handle image upload
        let bannerImageUrl;
        try {
            bannerImageUrl = await handleImageUpload(req.file, bannerImage);
        } catch (error) {
            res.status(500).json({
                status: "error",
                message: "Failed to upload image"
            });
            return;
        }

        const newBlog = await blogModel.create({
            title,
            description,
            content,
            slug,
            bannerImage: bannerImageUrl,
            tags,
            author: req.user?._id
        });

        res.status(201).json({
            status: "success",
            message: "Blog Created Successfully",
            data: newBlog
        });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Internal server error"
        });
        return;
    }
};

export const getBlogById = async (req: Request, res: Response<ApiResponse>) => {
    try {
        const blog = await blogModel.findById(req.params.id).lean();
        if (!blog) {
            res.status(404).json({
                status: "error",
                message: "Blog not found"
            });
            return;
        }

        res.json({
            status: "success",
            message: "Blog fetched successfully",
            data: blog
        });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Internal server error"
        });
        return;
    }
};

export const getBlogBySlug = async (req: Request, res: Response<ApiResponse>) => {
    try {
        const blog = await blogModel.findOne({ slug: req.params.slug }).lean();
        if (!blog) {
            res.status(404).json({
                status: "error",
                message: "Blog not found"
            });
            return;
        }

        res.json({
            status: "success",
            message: "Blog fetched successfully",
            data: blog
        });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Internal server error"
        })
        return;
    }
};

export const updateBlog = async (req: IRequest, res: Response<ApiResponse>) => {
    try {
        const body = blogInputSchema.partial().safeParse(req.body);
        if (!body.success) {
            res.status(400).json({
                status: "error",
                message: "Invalid input",
                error: body.error.flatten()
            });
            return;
        }

        const blog = await blogModel.findById(req.params.id);
        if (!blog) {
            res.status(404).json({
                status: "error",
                message: "Blog not found"
            });
            return;
        }

        // Handle image upload if new image is provided
        if (req.file || body.data.bannerImage) {
            try {
                const bannerImageUrl = await handleImageUpload(req.file, body.data.bannerImage);
                if (bannerImageUrl) {
                    body.data.bannerImage = bannerImageUrl;
                }
            } catch (error) {
                res.status(500).json({
                    status: "error",
                    message: "Failed to upload image"
                });
                return;
            }
        }

        const updatedBlog = await blogModel.findByIdAndUpdate(
            req.params.id,
            { $set: body.data },
            { new: true }
        ).lean();

        res.json({
            status: "success",
            message: "Blog updated successfully",
            data: updatedBlog
        });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Internal server error"
        });
        return;
    }
};

export const deleteBlog = async (req: IRequest, res: Response<ApiResponse>) => {
    try {
        const blog = await blogModel.findByIdAndDelete(req.params.id);
        if (!blog) {
            res.status(404).json({
                status: "error",
                message: "Blog not found"
            });
            return;
        }

        res.json({
            status: "success",
            message: "Blog deleted successfully"
        });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Internal server error"
        });
        return;
    }
};