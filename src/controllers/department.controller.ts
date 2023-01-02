import { PrismaClient } from "@prisma/client";
import { Request, Response} from "express";
import { StatusCodes } from "http-status-codes";
import createError from "http-errors";
import { Department } from "../models/department.model";

const prisma = new PrismaClient();

const createDepartment = async(req: Request, res: Response) => {
    const {body: departToUpdate} = req;
    const department = departToUpdate as Department;

    console.log("dept: ", department);
    //console.log("prisma : ", prisma);

    const createdDepartment = await prisma.department.create({
        data: {...department},
    });

    res.status(StatusCodes.CREATED).json(createdDepartment);
};


const deleteDepartment = async(req: Request, res: Response) => {
    const {id} = req.params;
    
    const department = await prisma.department.findUnique({
        where: {id},
    });

    if(!department){
        throw createError(StatusCodes.NOT_FOUND, `Department with id = ${id} is not found.`);
    }

    const deletedDepartment = await prisma.department.delete({
        where: {id},
    })

    res.status(StatusCodes.OK).json(deletedDepartment);
};


const editDepartment = async(req: Request, res: Response) => {
    const {body: departToUpdate} = req;
    const departmentToUpdate = departToUpdate as Department;

    const {id} = req.params;
    
    const department = await prisma.department.findUnique({
        where: {id},
    });

    if(!department){
        throw createError(StatusCodes.NOT_FOUND, `Department with id = ${id} is not found.`);
    }

    const updatedDepartment = await prisma.department.update({
        where: {id},
        data: {...departmentToUpdate},
    });

    res.status(StatusCodes.OK).json(updatedDepartment);
};


const getAllDepartments = async(req: Request, res: Response) => {
    const departments = await prisma.department.findMany({
        include: {
            employees: true,
        }
    });

    res.status(StatusCodes.OK).json(departments);
};


const getDepartmentById = async(req: Request, res: Response) => {
    const {id} = req.params;
    
    const department = await prisma.department.findUnique({
        where: {id},
        include: {
            employees: true,
        }
    });

    if(!department){
        throw createError(StatusCodes.NOT_FOUND, `Department with id = ${id} is not found.`);
    }

    res.status(StatusCodes.OK).json(department);
};

export {
    createDepartment,
    deleteDepartment,
    editDepartment,
    getAllDepartments,
    getDepartmentById
}