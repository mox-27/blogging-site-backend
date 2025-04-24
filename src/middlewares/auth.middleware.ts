import { NextFunction, Request, Response } from "express";

export const userProtected = async (req: Request, res: Response, next: NextFunction) => {
    console.log('This route is user protected');
    next();
};

export const adminProtected = async (req: Request, res: Response, next: NextFunction) => {
    console.log('This route is admin protected');
    next();
};