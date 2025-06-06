import { Status } from '../model/status';
import { StatusPayload } from '../types/payload.type';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';

//Create a new status
const createStatus = async (data: StatusPayload) => {
    const statusExist = await Status.findOne({ title: data.title });
    if (statusExist) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Status with this title already exists');
    }
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
