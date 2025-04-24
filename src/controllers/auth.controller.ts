import { Request, Response } from "express";

export const registerUser = async (req: Request, res: Response) => {
    res.send("Register User");
};

export const loginUser = async (req: Request, res: Response) => {
    res.send("Login User");
};

export const logoutUser = async (req: Request, res: Response) => {
    res.send("logout User");
};