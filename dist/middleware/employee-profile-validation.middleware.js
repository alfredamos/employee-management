"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeeProfileValidationMiddleware = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const http_status_codes_1 = require("http-status-codes");
const employee_profile_validation_1 = require("../validations/employee-profile.validation");
const employeeProfileValidationMiddleware = (req, res, next) => {
    const { body: employee } = req;
    const employeeVar = employee;
    const { error, value } = (0, employee_profile_validation_1.employeeProfileValidation)(employeeVar);
    if (error) {
        let errorMessages;
        errorMessages = error.details.map((err) => err.message).join(". ");
        next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.BAD_REQUEST, `${errorMessages} - please provides all required values.`));
        return;
    }
    next();
    return value;
};
exports.employeeProfileValidationMiddleware = employeeProfileValidationMiddleware;
