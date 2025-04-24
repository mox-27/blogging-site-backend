import { Request, Response } from 'express';
import userSchema from '../models/user.models';

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await userSchema.find().lean();
        res.json(users);
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

export const getUserById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await userSchema.findById(id).lean();

        if (!user) {
            res.status(404).json({
                status: "error",
                message: "User not found"
            });
            return;
        }

        res.json(user);
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

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await userSchema.deleteOne({ _id: id });

        if (result.deletedCount === 0) {
            res.status(404).json({
                status: "error",
                message: "User not found"
            });
            return;
        }

        res.json({
            status: "success",
            message: "User deleted successfully"
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
