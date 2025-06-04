import { EscalationRule } from "../model/escalationRule";
import ApiError from "../utils/ApiError";
import httpStatus from 'http-status';

// Escalation Rule Services
const createEscalationRule = async (data: any) => {
    const rule = new EscalationRule(data);
    await rule.save();
    return rule;
};

const getEscalationRules = async () => {
    return EscalationRule.find();
};

const updateEscalationRule = async (id: string, data: any) => {
    const rule = await EscalationRule.findByIdAndUpdate(id, data, { new: true });
    if (!rule) throw new ApiError(httpStatus.NOT_FOUND, 'Rule not found');
    return rule;
};

const deleteEscalationRule = async (id: string) => {
    await EscalationRule.findByIdAndDelete(id);
};

export default {
    createEscalationRule,
    getEscalationRules,
    updateEscalationRule,
    deleteEscalationRule
};