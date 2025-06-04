import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import { Request, Response, NextFunction } from 'express';
import { User } from '../model/user';
import config from '../config/config';

const auth = () => async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new ApiError(httpStatus.UNAUTHORIZED, 'Authorization token missing or malformed'));
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload: any = jwt.verify(token, config.jwt.secret);
    if (payload.type !== 'access') {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token type');
    }
    const user = await User.findById(payload.sub).select('id email role');
    if (!user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'User not found');
    }
    req.user = user;
    next();
  } catch (err: any) {
    next(new ApiError(httpStatus.UNAUTHORIZED, 'Invalid or expired token'));
  }
};

export default auth;
