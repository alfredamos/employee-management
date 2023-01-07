"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeeChangePasswordValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const employeeChangePasswordSchema = joi_1.default.object({
    email: joi_1.default.string().required().email(),
    oldPassword: joi_1.default.string().required(),
    newPassword: joi_1.default.string().required(),
    confirmPassword: joi_1.default.string().required(),
});
const employeeChangePasswordValidation = (employee) => {
    const { email, oldPassword, newPassword, confirmPassword } = employee;
    return employeeChangePasswordSchema.validate({
        email,
        oldPassword,
        newPassword,
        confirmPassword,
    });
};
exports.employeeChangePasswordValidation = employeeChangePasswordValidation;
