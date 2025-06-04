import escalationService from "../services/escalation.service";
import catchAsync from "../utils/catchAsync";
import httpStatus from 'http-status';


// Escalation Rule Actions
const createEscalationRule = catchAsync(async (req, res) => {
    const rule = await escalationService.createEscalationRule(req.body);
    res.status(httpStatus.CREATED).json(rule);
});

const getEscalationRules = catchAsync(async (_req, res) => {
    const rules = await escalationService.getEscalationRules();
    res.status(httpStatus.OK).json(rules);
});

const updateEscalationRule = catchAsync(async (req, res) => {
    const rule = await escalationService.updateEscalationRule(req.params.id, req.body);
    res.status(httpStatus.OK).json(rule);
});

const deleteEscalationRule = catchAsync(async (req, res) => {
    await escalationService.deleteEscalationRule(req.params.id);
    res.status(httpStatus.OK).json({ message: 'Escalation rule deleted' });
});

export default {
    createEscalationRule,
    getEscalationRules,
    updateEscalationRule,
    deleteEscalationRule
}