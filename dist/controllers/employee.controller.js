"use strict";
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
const prisma = new client_1.PrismaClient();
const createEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body: employToUpdate } = req;
    const employee = employToUpdate;
    const birthDate = employee.birthDate;
    if (typeof birthDate === "string") {
        employee.birthDate = new Date(birthDate);
    }
    const departmentId = employee.departmentId;
    const department = yield prisma.department.findUnique({
        where: { id: departmentId }
    });
    if (!department) {
        throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.NOT_FOUND, `Department does not exist`);
    }
    const createdEmployee = yield prisma.employee.create({
        data: Object.assign({}, employee),
    });
    res.status(http_status_codes_1.StatusCodes.CREATED).json(createdEmployee);
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
        where: { id: departmentId }
    });
    if (!department) {
        throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.NOT_FOUND, `Department does not exist`);
    }
    const updatedEmployee = yield prisma.employee.update({
        where: { id },
        data: Object.assign({}, employeeToUpdate),
    });
    res.status(http_status_codes_1.StatusCodes.OK).json(updatedEmployee);
});
exports.editEmployee = editEmployee;
const getAllEmployees = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const employees = yield prisma.employee.findMany({
        include: {
            department: true,
        }
    });
    res.status(http_status_codes_1.StatusCodes.OK).json(employees);
});
exports.getAllEmployees = getAllEmployees;
const getEmployeeById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const employee = yield prisma.employee.findUnique({
        where: { id },
        include: {
            department: true,
        }
    });
    if (!employee) {
        throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.NOT_FOUND, `Employee with id = ${id} is not found.`);
    }
    res.status(http_status_codes_1.StatusCodes.OK).json(employee);
});
exports.getEmployeeById = getEmployeeById;
