import { Department } from "../model/department"
import { DepartmentPayload } from "../types/payload.type";
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';

const createDepartment = async (departmentPayload: DepartmentPayload) => {
    // Check if department with the same name already exists
    const existingDepartment = await Department.findOne({ name: departmentPayload.name });
    if (existingDepartment) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Department with this name already exists');
    }
    const department = new Department({
        ...departmentPayload
    });
    await department.save();
    return department;
}

const getDepartments = async () => {
    const departments = await Department.find();
    return departments;
}

export default {
    createDepartment,
    getDepartments
}