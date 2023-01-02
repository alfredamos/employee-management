import { PrismaClient } from "@prisma/client";
import { Request, Response} from "express";
import { StatusCodes } from "http-status-codes";
import createError from "http-errors";
import { Employee } from "../models/employee.model";

const prisma = new PrismaClient();

const createEmployee = async(req: Request, res: Response) => {
    const {body: employToUpdate} = req;
    const employee = employToUpdate as Employee;

    const birthDate = employee.birthDate;

    if (typeof birthDate === "string"){
        employee.birthDate = new Date(birthDate);
    }

    const departmentId = employee.departmentId;

    const department = await prisma.department.findUnique({
        where: {id : departmentId}
    })

    if (!department){
        throw createError(StatusCodes.NOT_FOUND, `Department does not exist`);
    }

    const createdEmployee = await prisma.employee.create({
        data: {...employee},
    });

    res.status(StatusCodes.CREATED).json(createdEmployee);
};


const deleteEmployee = async(req: Request, res: Response) => {
    const {id} = req.params;
    
    const employee = await prisma.employee.findUnique({
        where: {id},
    });

    if(!employee){
        throw createError(StatusCodes.NOT_FOUND, `Employee with id = ${id} is not found.`);
    }

    const deletedEmployee = await prisma.employee.delete({
        where: {id},
    })

    res.status(StatusCodes.OK).json(deletedEmployee);
};


const editEmployee = async(req: Request, res: Response) => {
    const {body: employToUpdate} = req;
    const employeeToUpdate = employToUpdate as Employee;

    const {id} = req.params;
    
    const employee = await prisma.employee.findUnique({
        where: {id},
    });

    if(!employee){
        throw createError(StatusCodes.NOT_FOUND, `Employee with id = ${id} is not found.`);
    }    

    const birthDate = employeeToUpdate.birthDate;

    if (typeof birthDate === "string"){
        employeeToUpdate.birthDate = new Date(birthDate);
    }

    const departmentId = employeeToUpdate.departmentId;

    const department = await prisma.department.findUnique({
        where: {id : departmentId}
    })

    if (!department){
        throw createError(StatusCodes.NOT_FOUND, `Department does not exist`);
    }

    const updatedEmployee = await prisma.employee.update({
        where: {id},
        data: {...employeeToUpdate},
    });

    res.status(StatusCodes.OK).json(updatedEmployee);
};


const getAllEmployees = async(req: Request, res: Response) => {
    const employees = await prisma.employee.findMany({
        include: {
            department: true,
        }
    });

    res.status(StatusCodes.OK).json(employees);
};


const getEmployeeById = async(req: Request, res: Response) => {
    const {id} = req.params;
    
    const employee = await prisma.employee.findUnique({
        where: {id},
        include: {
            department: true,
        }
    });

    if(!employee){
        throw createError(StatusCodes.NOT_FOUND, `Employee with id = ${id} is not found.`);
    }

    res.status(StatusCodes.OK).json(employee);
};

export {
    createEmployee,
    deleteEmployee,
    editEmployee,
    getAllEmployees,
    getEmployeeById
}