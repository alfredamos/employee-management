"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeeValidationMiddleware = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const http_status_codes_1 = require("http-status-codes");
const employee_validation_1 = require("../validations/employee.validation");
const employeeValidationMiddleware = (req, res, next) => {
    const { body: employ } = req;
    const employee = employ;
    const { error, value } = (0, employee_validation_1.employeeValidation)(employee);
    if (error) {
        let errorMessages = [];
        for (const err of error.details) {
            errorMessages.push(err.message);
        }
        throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.BAD_REQUEST, `${errorMessages} - please provides all required values.`);
    }
    next();
    return value;
};
exports.employeeValidationMiddleware = employeeValidationMiddleware;
