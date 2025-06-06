import httpStatus from 'http-status';
import { authService } from '../services';
import catchAsync from '../utils/catchAsync';

const oAuthLogin = catchAsync(async (req, res) => {
    const user = await authService.findOrCreateOAuthUser(req);
    const statusCode = user.status || httpStatus.CREATED;
    const { status, ...userWithoutStatus } = user;
    res.status(statusCode).json(userWithoutStatus);
});

const logout = catchAsync(async (req, res) => {
    const user = await authService.logout(req.body.userId);
    res.status(httpStatus.NO_CONTENT).json(user);
})

export default {
    oAuthLogin,
    logout
};
