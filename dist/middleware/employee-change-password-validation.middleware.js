"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeeChangePasswordValidationMiddleware = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const http_status_codes_1 = require("http-status-codes");
const employee_change_password_validation_1 = require("../validations/employee-change-password.validation");
const employeeChangePasswordValidationMiddleware = (req, res, next) => {
    const { body: employee } = req;
    const employeeVar = employee;
    const { error, value } = (0, employee_change_password_validation_1.employeeChangePasswordValidation)(employeeVar);
    if (error) {
        let errorMessages;
        errorMessages = error.details.map((err) => err.message).join(". ");
        next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.BAD_REQUEST, `${errorMessages} - please provides all required values.`));
        return;
    }
    next();
    return value;
};
exports.employeeChangePasswordValidationMiddleware = employeeChangePasswordValidationMiddleware;
