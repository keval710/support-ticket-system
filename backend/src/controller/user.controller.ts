import catchAsync from "../utils/catchAsync";
import { userService } from "../services";

const getUsers = catchAsync(async (req, res) => {
    const users = await userService.getUsers();
    res.status(200).json(users);
});

const getUserById = catchAsync(async (req, res) => {
    const user = await userService.getUserById(req.params.id);
    res.status(200).json(user);
});

export default { 
    getUsers, 
    getUserById 
};
