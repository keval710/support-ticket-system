import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import { statusService } from '../services';

const createStatus = catchAsync(async (req: Request, res: Response) => {
    const status = await statusService.createStatus(req.body);
    res.status(httpStatus.CREATED).json(status);
});

const getAllStatuses = catchAsync(async (_req: Request, res: Response) => {
    const statuses = await statusService.getAllStatuses();
    res.status(httpStatus.OK).json(statuses);
});

const updateStatus = catchAsync(async (req: Request, res: Response) => {
    const status = await statusService.updateStatus(req.params.id, req.body);
    res.status(httpStatus.OK).json(status);
});

const deleteStatus = catchAsync(async (req: Request, res: Response) => {
    const result = await statusService.deleteStatus(req.params.id);
    res.status(httpStatus.OK).json(result);
});

export default {
    createStatus,
    getAllStatuses,
    updateStatus,
    deleteStatus,
};
