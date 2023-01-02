import { PrismaClient, UserType } from "@prisma/client";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchError from "http-errors";
import { Employee } from "../models/employee.model";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { EmployeeInfo } from "../models/employee-info.model";

const prisma = new PrismaClient();

const employeeLogin = async (req: Request, res: Response) => {
  const { body: employeeToLogin } = req;

  const loggedInEmployee = employeeToLogin as Employee;
  const { email, password } = loggedInEmployee;

  //----> Check for the existent of the employee and uniqueness of email.
  const employee = await prisma.employee.findUnique({ where: { email } });

  if (!employee) {
    throw catchError(StatusCodes.BAD_REQUEST, "Invalid credentials.");
  }

  //----> Check for the validity of password.
  const hashedPassword = employee.password;

  const isValid = await bcrypt.compare(password, hashedPassword);

  if (!isValid) {
    throw catchError(StatusCodes.BAD_REQUEST, "Invalid credentials");
  }

  //----> Get Json web token
  const token = await generateJwtToken(
    employee.id,
    employee.fullName,
    employee.userType
  );

  //----> Employee info.
  const employeeEmployeeInfo: EmployeeInfo = {
    id: employee.id,
    fullName: employee.fullName,
    userType: employee.userType,
    token,
  };

  //----> Send employee info to the client.
  res.status(StatusCodes.OK).json(employeeEmployeeInfo);
};


const employeeSignUp = async (req: Request, res: Response) => {
  const { body: employeeToSignUp } = req;

  const signUpEmployee = employeeToSignUp as Employee;

  const { email, password } = signUpEmployee;

  //----> Check for the existent of the employee's department.
  const departmentId = employeeToSignUp.departmentId;

  const department = await prisma.department.findUnique({
    where: { id: departmentId },
  });

  if (!department) {
    throw catchError(StatusCodes.NOT_FOUND, `Department does not exist`);
  }


  //----> Check for the existent of the employee and uniqueness of email.
  const employeeExist = await prisma.employee.findUnique({ where: { email } });

  if (employeeExist) {
    throw catchError(StatusCodes.BAD_REQUEST, "Employee already exists.");
  }

  //----> Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  signUpEmployee.password = hashedPassword;

  //----> Make sure the date has the proper data type.
  const birthDate = signUpEmployee.birthDate;

  if (typeof birthDate === 'string'){
    signUpEmployee.birthDate = new Date(birthDate);
  }

  //----> Save the employee.
  const savedEmployee = await prisma.employee.create({
    data: { ...signUpEmployee },
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


async function generateJwtToken(id: string, name: string, userType: UserType){
    return await jwt.sign({
        id,
        name,
        userType
    }, process.env.JSON_WEB_TOKEN!, {
        expiresIn: '1hr'
    });
}

export {
    employeeLogin,
    employeeSignUp

}