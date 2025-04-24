import { Request, Response } from 'express';

export const getAllUsers = async (req: Request, res: Response) => {
    res.send("Get all users");
};

export const getUserById = async (req: Request, res: Response) => {
    const { id } = req.params;
    res.send("Get user by id");
};

export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    res.send("Delete user");
};