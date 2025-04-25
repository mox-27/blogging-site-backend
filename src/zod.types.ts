import { z } from 'zod';

export const registerInputSchema = z.object({
    name:z.string(),
    username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
    email: z.string().email(),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    role: z.enum(['Admin', 'User']).optional(),
});

export const loginInputSchema = z.object({
    identifier: z.string().min(3), // can be email or username
    password: z.string().min(6),
});


export const blogInputSchema = z.object({
    title: z.string().min(1, "Title cannot be empty"),
    description: z.string().max(500).optional(),
    content: z.array(z.any()),
    bannerImage: z.string().url("Must be a valid URL").optional(),
    tags: z.array(z.string().min(1)).max(10).optional(),
});
