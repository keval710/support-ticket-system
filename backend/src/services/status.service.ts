import { Status } from '../model/status';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';

/**
 * Create a new status
 */
const createStatus = async (data: any) => {
    const status = new Status(data);
    await status.save();
    return status;
};

/**
 * Get all statuses
 */
const getAllStatuses = async () => {
    return Status.find();
};

/**
 * Update a status by ID
 */
const updateStatus = async (id: string, data: any) => {
    const status = await Status.findByIdAndUpdate(id, data, { new: true });
    if (!status) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Status not found');
    }
    return status;
};

/**
 * Delete a status by ID
 */
const deleteStatus = async (id: string) => {
    const result = await Status.findByIdAndDelete(id);
    if (!result) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Status not found');
    }
    return { message: 'Status deleted' };
};

export default {
    createStatus,
    getAllStatuses,
    updateStatus,
    deleteStatus,
};
