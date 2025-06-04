import httpStatus from 'http-status';
import { authService } from '../services';
import catchAsync from '../utils/catchAsync';

const oAuthLogin = catchAsync(async (req, res) => {
    const user = await authService.findOrCreateOAuthUser(req);
    res.status(httpStatus.CREATED).json(user)
});

export default {
    oAuthLogin
};
