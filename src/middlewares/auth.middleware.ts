import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import userSchema, { IUser } from '../models/user.models';

export interface IRequest extends Request {
    user?: IUser | null;
}

interface ITokenPayload extends JwtPayload {
    id: string;
}

export const userProtected = async (req: IRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

        if (!token) {
            res.status(401).json({
                status: "error",
                message: "Authentication token missing"
            });
            return;
        }

        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not configured');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET) as ITokenPayload;

        const user = await userSchema.findById(decoded.id);

        if (!user) {
            res.status(401).json({
                status: "error",
                message: "User not found"
            });
            return;
        }

        req.user = user;
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({
                status: "error",
                message: "Invalid token"
            });
            return;
        }

        res.status(500).json({
            status: "error",
            message: "Internal server error"
        });
        return;
    }
};

export const adminProtected = async (req: IRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            res.status(401).json({
                status: "error",
                message: "Authentication required"
            });
            return;
        }

        if (req.user.role !== 'Admin') {
            res.status(403).json({
                status: "error",
                message: "Admin access required"
            });
            return;
        }

        next();
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Internal server error"
        });
        return;
    }
};