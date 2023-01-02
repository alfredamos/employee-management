import { PrismaClient, UserType } from "@prisma/client";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchError from "http-errors";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { Employee } from "../models/employee.model";
import { EmployeeInfo } from "../models/employee-info.model";

const prisma = new PrismaClient();

const createEmployee = async (req: Request, res: Response) => {
  const { body: employToUpdate } = req;
  const employee = employToUpdate as Employee;

  const birthDate = employee.birthDate;

  //----> Make sure the date has the proper data type.
  if (typeof birthDate === "string") {
    employee.birthDate = new Date(birthDate);
  }

  //----> Check for existence of employee's department.
  const departmentId = employee.departmentId;

  const department = await prisma.department.findUnique({
    where: { id: departmentId },
  });

  if (!department) {
    throw catchError(StatusCodes.NOT_FOUND, `Department does not exist`);
  }

  const { email, password } = employee; //----> Destructure email and password from employee.

  //----> Check for the existent of the employee and email uniqueness.
  const employeeExist = await prisma.employee.findUnique({ where: { email } });

  if (employeeExist) {
    throw catchError(StatusCodes.BAD_REQUEST, "Employee already exists.");
  }

  //----> Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  employee.password = hashedPassword;

  //----> Save the employee.
  const savedEmployee = await prisma.employee.create({
    data: { ...employee },
  });

  //----> Get Json web token
  const token = await generateJwtToken(
    savedEmployee.id,
    savedEmployee.fullName,
    savedEmployee.userType
  );

  //----> User info
  const employeeEmployeeInfo: EmployeeInfo = {
    id: savedEmployee.id,
    fullName: savedEmployee.fullName,
    userType: savedEmployee.userType,
    token,
  };

  //----> Send the user info to client.
  res.status(StatusCodes.CREATED).json(employeeEmployeeInfo);
};


const deleteEmployee = async (req: Request, res: Response) => {
  const { id } = req.params;

  const employee = await prisma.employee.findUnique({
    where: { id },
  });

  if (!employee) {
    throw catchError(
      StatusCodes.NOT_FOUND,
      `Employee with id = ${id} is not found.`
    );
  }

  const deletedEmployee = await prisma.employee.delete({
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

  res.status(StatusCodes.OK).json(deletedEmployee);
};

const editEmployee = async (req: Request, res: Response) => {
  const { body: employToUpdate } = req;
  const employeeToUpdate = employToUpdate as Employee;

  const { id } = req.params;

  const employee = await prisma.employee.findUnique({
    where: { id },
  });

  if (!employee) {
    throw catchError(
      StatusCodes.NOT_FOUND,
      `Employee with id = ${id} is not found.`
    );
  }

  const birthDate = employeeToUpdate.birthDate;

  if (typeof birthDate === "string") {
    employeeToUpdate.birthDate = new Date(birthDate);
  }

  const departmentId = employeeToUpdate.departmentId;

  const department = await prisma.department.findUnique({
    where: { id: departmentId },
  });

  if (!department) {
    throw catchError(StatusCodes.NOT_FOUND, `Department does not exist`);
  }

  const updatedEmployee = await prisma.employee.update({
    where: { id },
    data: { ...employeeToUpdate },
    select: {
      id: true,
      fullName: true,
      userType: true,
      gender: true,
      email: true,
      phone: true,
      birthDate: true,
      department:{
        select: {
          name: true
      },
      }
    },
    });

  res.status(StatusCodes.OK).json(updatedEmployee);
};

const getAllEmployees = async (req: Request, res: Response) => {
  const employees = await prisma.employee.findMany({
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
  
  res.status(StatusCodes.OK).json(employees);
};

const getEmployeeById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const employee = await prisma.employee.findUnique({
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
    throw catchError(
      StatusCodes.NOT_FOUND,
      `Employee with id = ${id} is not found.`
    );
  }

  res.status(StatusCodes.OK).json(employee);
};


async function generateJwtToken(id: string, name: string, userType: UserType) {
  return await jwt.sign(
    {
      id,
      name,
      userType,
    },
    process.env.JSON_WEB_TOKEN!,
    {
      expiresIn: "1hr",
    }
  );
}


export {
  createEmployee,
  deleteEmployee,
  editEmployee,
  getAllEmployees,
  getEmployeeById,
};
