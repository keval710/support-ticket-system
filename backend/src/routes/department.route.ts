import express from 'express';
import Joi from 'joi';
import { Department } from '../model/department';

const router = express.Router();

const departmentSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().optional(),
    email: Joi.string().email().optional(),
    assignedAdmins: Joi.array().items(Joi.string()).optional(),
    hidden: Joi.boolean().optional()
});

// Create Department
router.post('/', async (req, res) => {
    const { error, value } = departmentSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details });

    try {
        const department = new Department(value);
        await department.save();
        res.status(201).json(department);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create department' });
    }
});

// Get all Departments
router.get('/', async (_req, res) => {
    try {
        const departments = await Department.find();
        res.json(departments);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch departments' });
    }
});

// Update Department
router.put('/:id', async (req, res) => {
    const { error, value } = departmentSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details });

    try {
        const department = await Department.findByIdAndUpdate(req.params.id, value, { new: true });
        res.json(department);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update department' });
    }
});

// Delete Department
router.delete('/:id', async (req, res) => {
    try {
        await Department.findByIdAndDelete(req.params.id);
        res.json({ message: 'Department deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete department' });
    }
});

export default router;
