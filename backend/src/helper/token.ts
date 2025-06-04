import { NextFunction, Request, Response } from "express";
import Jwt from "jsonwebtoken"

export const genToken = async ({ id }: any) => {
    try {
        if (id) {
            const token = Jwt.sign({ id }, 'secret');
            return token && token
        } else {
            throw new Error('id not found')
        }
    } catch (error: any) {
        throw new Error(error)
    }
}

export const verifyToken = async (req: Request, res: any, next: NextFunction) => {
    try {
        const token: any = req.headers.cookies;
        if (token) {
            try {
                const verify: any = Jwt.verify(token, 'secret');                
                if (verify) {
                    res.id = verify.id;
                    next();
                } else {
                    res.status(400).json({ error: 'Invalid token' });
                }
            } catch (error) {
                res.status(400).json({ error: 'Invalid token' });
            }
        } else {
            res.status(404).json({ error: 'Unauthorized user' })
        }
    } catch (error: any) {
        throw new Error(error)
    }
}