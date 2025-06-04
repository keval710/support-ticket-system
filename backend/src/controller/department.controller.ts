import catchAsync from "../utils/catchAsync";
import { departmentService } from "../services";

const createDepartment = catchAsync(async (req, res) => {
    const department = await departmentService.createDepartment(req.body);
    res.status(201).json(department);
});

const getDepartments = catchAsync(async(req, res) => {
    const departments = await departmentService.getDepartments();
    res.status(200).json(departments);
})

export default {
    createDepartment,
    getDepartments
}