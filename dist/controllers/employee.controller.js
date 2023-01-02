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
exports.getEmployeeById = exports.getAllEmployees = exports.editEmployee = exports.deleteEmployee = exports.createEmployee = void 0;
const client_1 = require("@prisma/client");
const http_status_codes_1 = require("http-status-codes");
const http_errors_1 = __importDefault(require("http-errors"));
const bcrypt = __importStar(require("bcrypt"));
const jwt = __importStar(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const createEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body: employToUpdate } = req;
    const employee = employToUpdate;
    const birthDate = employee.birthDate;
    //----> Make sure the date has the proper data type.
    if (typeof birthDate === "string") {
        employee.birthDate = new Date(birthDate);
    }
    //----> Check for existence of employee's department.
    const departmentId = employee.departmentId;
    const department = yield prisma.department.findUnique({
        where: { id: departmentId },
    });
    if (!department) {
        throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.NOT_FOUND, `Department does not exist`);
    }
    const { email, password } = employee; //----> Destructure email and password from employee.
    //----> Check for the existent of the employee and email uniqueness.
    const employeeExist = yield prisma.employee.findUnique({ where: { email } });
    if (employeeExist) {
        throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.BAD_REQUEST, "Employee already exists.");
    }
    //----> Hash password
    const hashedPassword = yield bcrypt.hash(password, 10);
    employee.password = hashedPassword;
    //----> Save the employee.
    const savedEmployee = yield prisma.employee.create({
        data: Object.assign({}, employee),
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
exports.createEmployee = createEmployee;
const deleteEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const employee = yield prisma.employee.findUnique({
        where: { id },
    });
    if (!employee) {
        throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.NOT_FOUND, `Employee with id = ${id} is not found.`);
    }
    const deletedEmployee = yield prisma.employee.delete({
        where: { id },
        select: {
            id: true,
            fullName: true,
            userType: true,
            gender: true,
            email: true,
            phone: true,
            birthDate: true,
            department: true,
        },
    });
    res.status(http_status_codes_1.StatusCodes.OK).json(deletedEmployee);
});
exports.deleteEmployee = deleteEmployee;
const editEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body: employToUpdate } = req;
    const employeeToUpdate = employToUpdate;
    const { id } = req.params;
    const employee = yield prisma.employee.findUnique({
        where: { id },
    });
    if (!employee) {
        throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.NOT_FOUND, `Employee with id = ${id} is not found.`);
    }
    const birthDate = employeeToUpdate.birthDate;
    if (typeof birthDate === "string") {
        employeeToUpdate.birthDate = new Date(birthDate);
    }
    const departmentId = employeeToUpdate.departmentId;
    const department = yield prisma.department.findUnique({
        where: { id: departmentId },
    });
    if (!department) {
        throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.NOT_FOUND, `Department does not exist`);
    }
    const updatedEmployee = yield prisma.employee.update({
        where: { id },
        data: Object.assign({}, employeeToUpdate),
        select: {
            id: true,
            fullName: true,
            userType: true,
            gender: true,
            email: true,
            phone: true,
            birthDate: true,
            department: {
                select: {
                    name: true
                },
            }
        },
    });
    res.status(http_status_codes_1.StatusCodes.OK).json(updatedEmployee);
});
exports.editEmployee = editEmployee;
const getAllEmployees = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const employees = yield prisma.employee.findMany({
        select: {
            id: true,
            fullName: true,
            userType: true,
            gender: true,
            email: true,
            phone: true,
            birthDate: true,
            department: {
                select: {
                    name: true,
                },
            },
        },
    });
    res.status(http_status_codes_1.StatusCodes.OK).json(employees);
});
exports.getAllEmployees = getAllEmployees;
const getEmployeeById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const employee = yield prisma.employee.findUnique({
        where: { id },
        select: {
            id: true,
            fullName: true,
            userType: true,
            gender: true,
            email: true,
            phone: true,
            birthDate: true,
            department: {
                select: {
                    name: true,
                },
            },
        },
    });
    if (!employee) {
        throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.NOT_FOUND, `Employee with id = ${id} is not found.`);
    }
    res.status(http_status_codes_1.StatusCodes.OK).json(employee);
});
exports.getEmployeeById = getEmployeeById;
function generateJwtToken(id, name, userType) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield jwt.sign({
            id,
            name,
            userType,
        }, process.env.JSON_WEB_TOKEN, {
            expiresIn: "1hr",
        });
    });
}
