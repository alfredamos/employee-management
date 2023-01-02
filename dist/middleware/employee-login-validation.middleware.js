"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeeLoginValidationMiddleware = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const http_status_codes_1 = require("http-status-codes");
const employee_login_validation_1 = require("../validations/employee-login.validation");
const employeeLoginValidationMiddleware = (req, res, next) => {
    const { body: employ } = req;
    const employee = employ;
    const { error, value } = (0, employee_login_validation_1.employeeLoginValidation)(employee);
    if (error) {
        let errorMessages;
        errorMessages = error.details.map(err => err.message).join('. ');
        throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.BAD_REQUEST, `${errorMessages} - please provides all required values.`);
    }
    next();
    return value;
};
exports.employeeLoginValidationMiddleware = employeeLoginValidationMiddleware;
