import jwt from 'jsonwebtoken';
import config from '../config/config';
import { tokenPayload } from '../types/payload.type';

const generateToken = (user: tokenPayload) => {
    return jwt.sign(
        { sub: user._id, email: user.email, role: user.role, type: 'access' },
        config.jwt.secret,
        { expiresIn: config.jwt.accessExpirationMinutes }
    );
};

export default {
    generateToken
}