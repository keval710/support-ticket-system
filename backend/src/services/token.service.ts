import jwt from 'jsonwebtoken';
import config from '../config/config';

const generateToken = (user: any) => {
    return jwt.sign(
        { sub: user._id, email: user.email, role: user.role, type: 'access' },
        config.jwt.secret,
        { expiresIn: config.jwt.accessExpirationMinutes }
    );
};

export default {
    generateToken
}