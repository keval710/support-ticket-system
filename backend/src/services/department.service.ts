import { Department } from "../model/department"
import { DepartmentPayload } from "../types/payload.type";

const createDepartment = async (departmentPayload: DepartmentPayload) => {
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