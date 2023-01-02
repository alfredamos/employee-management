"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeeSignUp = exports.employeeLogin = void 0;
const client_1 = require("@prisma/client");
const http_status_codes_1 = require("http-status-codes");
const http_errors_1 = __importDefault(require("http-errors"));
const bcrypt = __importStar(require("bcrypt"));
const jwt = __importStar(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const employeeLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body: employeeToLogin } = req;
    const loggedInEmployee = employeeToLogin;
    const { email, password } = loggedInEmployee;
    //----> Check for the existent of the employee and uniqueness of email.
    const employee = yield prisma.employee.findUnique({ where: { email } });
    if (!employee) {
        throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.BAD_REQUEST, "Invalid credentials.");
    }
    //----> Check for the validity of password.
    const hashedPassword = employee.password;
    const isValid = yield bcrypt.compare(password, hashedPassword);
    if (!isValid) {
        throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.BAD_REQUEST, "Invalid credentials");
    }
    //----> Get Json web token
    const token = yield generateJwtToken(employee.id, employee.fullName, employee.userType);
    //----> Employee info.
    const employeeEmployeeInfo = {
        id: employee.id,
        fullName: employee.fullName,
        userType: employee.userType,
        token,
    };
    //----> Send employee info to the client.
    res.status(http_status_codes_1.StatusCodes.OK).json(employeeEmployeeInfo);
});
exports.employeeLogin = employeeLogin;
const employeeSignUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body: employeeToSignUp } = req;
    const signUpEmployee = employeeToSignUp;
    const { email, password } = signUpEmployee;
    //----> Check for the existent of the employee's department.
    const departmentId = employeeToSignUp.departmentId;
    const department = yield prisma.department.findUnique({
        where: { id: departmentId },
    });
    if (!department) {
        throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.NOT_FOUND, `Department does not exist`);
    }
    //----> Check for the existent of the employee and uniqueness of email.
    const employeeExist = yield prisma.employee.findUnique({ where: { email } });
    if (employeeExist) {
        throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.BAD_REQUEST, "Employee already exists.");
    }
    //----> Hash password
    const hashedPassword = yield bcrypt.hash(password, 10);
    signUpEmployee.password = hashedPassword;
    //----> Make sure the date has the proper data type.
    const birthDate = signUpEmployee.birthDate;
    if (typeof birthDate === 'string') {
        signUpEmployee.birthDate = new Date(birthDate);
    }
    //----> Save the employee.
    const savedEmployee = yield prisma.employee.create({
        data: Object.assign({}, signUpEmployee),
    });
    //----> Get Json web token
    const token = yield generateJwtToken(savedEmployee.id, savedEmployee.fullName, savedEmployee.userType);
    //----> User info
    const employeeEmployeeInfo = {
        id: savedEmployee.id,
        fullName: savedEmployee.fullName,
        userType: savedEmployee.userType,
        token,
    };
    //----> Send the user info to client.
    res.status(http_status_codes_1.StatusCodes.CREATED).json(employeeEmployeeInfo);
});
exports.employeeSignUp = employeeSignUp;
function generateJwtToken(id, name, userType) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield jwt.sign({
            id,
            name,
            userType
        }, process.env.JSON_WEB_TOKEN, {
            expiresIn: '1hr'
        });
    });
}
