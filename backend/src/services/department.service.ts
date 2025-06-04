import { Department } from "../model/department"

const createDepartment = async (departmentPayload: any) => {
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