"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeeValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const employeeSchema = joi_1.default.object({
    fullName: joi_1.default.string().required(),
    password: joi_1.default.string().required(),
    departmentId: joi_1.default.string().required(),
    email: joi_1.default.string().required().email(),
    phone: joi_1.default.string().required(),
});
const employeeValidation = (employee) => {
    const { fullName, email, phone, departmentId, password, } = employee;
    return employeeSchema.validate({
        fullName,
        email,
        phone,
        departmentId,
        password
    }, { abortEarly: false });
};
exports.employeeValidation = employeeValidation;
