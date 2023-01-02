"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeeLoginValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const employeeSchema = joi_1.default.object({
    password: joi_1.default.string().required(),
    email: joi_1.default.string().required().email(),
});
const employeeLoginValidation = (employee) => {
    const { email, password } = employee;
    return employeeSchema.validate({
        email,
        password,
    }, { abortEarly: false });
};
exports.employeeLoginValidation = employeeLoginValidation;
