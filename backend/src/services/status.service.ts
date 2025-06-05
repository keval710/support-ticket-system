import { Status } from '../model/status';
import { StatusPayload } from '../types/payload.type';

//Create a new status
const createStatus = async (data: StatusPayload) => {
    const status = new Status(data);
    await status.save();
    return status;
};

//Get all statuses
const getAllStatuses = async () => {
    return Status.find();
};

export default {
    createStatus,
    getAllStatuses
};
