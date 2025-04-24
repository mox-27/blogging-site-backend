import { Request, Response } from "express";
import { loginInputSchema, registerInputSchema } from '../zod.types';
import userSchema from '../models/user.models';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const registerUser = async (req: Request, res: Response) => {
    try {
        const body = registerInputSchema.safeParse(req.body);
        if (!body.success) {
            res.status(400).json({
                status: "error",
                message: "Invalid input",
                error: body.error.flatten()
            });
            return;
        }

        const { name, username, email, password } = body.data;

        // Check if user already exists
        const existingUser = await userSchema.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            res.status(409).json({
                status: "error",
                message: "Email or username already exists"
            });
            return;
        }



        const newUser = await userSchema.create({
            name,
            username,
            email,
            password
        });

        const token = jwt.sign(
            { id: newUser._id },
            process.env.JWT_SECRET as string,
            { expiresIn: '24h' }
        );

        // Set cookie with token
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
        });

        res.status(201).json({
            status: "success",
            message: "User registered successfully",
            token
        });
        return;
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Internal server error"
        });
        return;
    }
};

export const loginUser = async (req: Request, res: Response) => {
    try {
        const body = loginInputSchema.safeParse(req.body);
        if (!body.success) {
            res.status(400).json({
                message: "Invalid input",
                error: body.error.flatten()
            });
            return;
        }

        const { identifier, password } = body.data;

        const dbUser = await userSchema.findOne({
            $or: [
                { username: identifier },
                { email: identifier }
            ]
        }).select('+password');

        if (!dbUser || !(await bcrypt.compare(password, dbUser.password))) {
            res.status(401).json({
                status: "error",
                message: "Invalid credentials"
            });
            return;
        }

        const token = jwt.sign(
            { id: dbUser._id },
            process.env.JWT_SECRET as string,
            { expiresIn: '24h' }
        );

        // Set cookie with token
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
        });

        res.status(200).json({
            status: "success",
            message: "Login successful",
            token
        });
        return;
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Internal server error"
        });
        return;
    }
};

export const logoutUser = async (req: Request, res: Response) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        res.status(200).json({
            status: "success",
            message: "Logged out successfully"
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Internal server error"
        });
    }
};