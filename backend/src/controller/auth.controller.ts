import httpStatus from 'http-status';
import { authService } from '../services';
import catchAsync from '../utils/catchAsync';

const oAuthLogin = catchAsync(async (req, res) => {
    const user = await authService.findOrCreateOAuthUser(req);
    res.status(httpStatus.CREATED).json(user)
});

    const logout = catchAsync(async (req, res) => {
    const user = await authService.logout(req.body.userId);
    res.status(httpStatus.OK).json(user)
})

export default {
    oAuthLogin,
    logout
};
