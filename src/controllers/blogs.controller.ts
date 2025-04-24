import { Request, Response } from "express"

export const getAllBlogs = async (req: Request, res: Response) => {
    res.send('Get all blogs')
};

export const createBlog = async (req: Request, res: Response) => {
    res.send("create a blog");
};

export const getBlogById = async (req: Request, res: Response) => {
    const { id } = req.params;
    res.send("Get single blog by id");
};

export const getBlogBySlug = async (req: Request, res: Response) => {
    const { slug } = req.params;
    res.send(`Get blog by slug ${slug}`);
};

export const updateBlog = async (req: Request, res: Response) => {
    const { id } = req.params;
    res.send("Update blog");
};

export const deleteBlog = async (req: Request, res: Response) => {
    const { id } = req.params;
    res.send("Delete blog");
};