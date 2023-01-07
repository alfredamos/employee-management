import { PrismaClient, UserType } from "@prisma/client";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchError from "http-errors";
import { Employee } from "../models/employee.model";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { EmployeeInfo } from "../models/employee-info.model";
import { EmployeeChangePassword } from "../models/employee-change-password.model";
import { UuidTool } from "uuid-tool";


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


const changePasswordOfEmployee = async (req: Request, res: Response) => {
  const { body: employeeChangePwd } = req;

  const employeeChangePassword = employeeChangePwd as EmployeeChangePassword;
  const { email, oldPassword, newPassword, confirmPassword } =
    employeeChangePassword;

  //----> New password must match the confirm password.
  if (newPassword.normalize() !== confirmPassword.normalize()) {
    throw catchError(
      StatusCodes.BAD_REQUEST,
      "new password does not match confirm password."
    );
  }

  const employee = await prisma.employee.findUnique({
    where: { email },
  });

  if (!employee) {
    throw catchError(StatusCodes.BAD_REQUEST, "Invalid credentials");
  }

  //----> Retrieve the old password from database
  const hashedPassword = employee.password;

  const isValid = await bcrypt.compare(oldPassword, hashedPassword); //----> Compare the old password with the password stored in the database.

  //----> Check the validity of password.
  if (!isValid) {
    throw catchError(StatusCodes.BAD_REQUEST, "Invalid credentials");
  }

  //----> Hash the new password.
  const newHashedPassword = await bcrypt.hash(newPassword, 10);

  //----> Store the new password in the database.
  const updatedEmployee = await prisma.employee.update({
    where: { email },
    data: { ...employee, password: newHashedPassword },
  });

  //----> Make a employee object information.
  const employeeInfo: EmployeeInfo = {
    id: updatedEmployee.id,
    fullName: updatedEmployee.fullName,
    userType: updatedEmployee.userType,
    message: "Password is changed successfully, please login.",
  };

  //----> Send the employee information to client.
  res.status(StatusCodes.OK).json(employeeInfo);
};


const profileOfEmployeeById = async (req: Request, res: Response) => {
  const { body: employeeInput } = req;
  const { id } = req.params;
  const employee = employeeInput as Employee;

  const { email, password, newPassword, id: employeeId } = employee;

  //----> Check for correctness of id.
  let isEqual = UuidTool.compare(id, employeeId);
  if (!isEqual) {
    throw catchError(StatusCodes.BAD_REQUEST, "Id mismatch");
  }

  //---> Check if employee exists already.
  const existingEmployee = await prisma.employee.findUnique({
    where: { email },
  });

  if (!existingEmployee) {
    throw catchError(StatusCodes.BAD_REQUEST, "Invalid credentials");
  }

  //----> Check for the correctness of the employee password.
  const isValid = await bcrypt.compare(password, existingEmployee.password);

  if (!isValid) {
    throw catchError(StatusCodes.BAD_REQUEST, "Invalid credentials");
  }

  //----> Hash the new password.
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  employee.password = hashedPassword;

  delete employee.newPassword;

  //----> Make sure the date has the proper data type.
  const birthDate = employee.birthDate;

  if (typeof birthDate === "string") {
    employee.birthDate = new Date(birthDate);
  } 

  //----> Store the new password in the database.

  const updatedEmployee = await prisma.employee.update({
    where: { id },
    data: { ...employee },
  });

  //----> Make a employee object information.
  const employeeInfo: EmployeeInfo = {
    id: updatedEmployee.id,
    fullName: updatedEmployee.fullName,
    userType: updatedEmployee.userType,
    message: "Password is changed successfully, please login.",
  };

  //----> Send the employee information to client.
  res.status(StatusCodes.OK).json(employeeInfo);
};


const profileOfEmployee = async (req: Request, res: Response) => {
  const { body: employeeInput } = req;
  
  const employee = employeeInput as Employee;

  const { email, password, newPassword } = employee;

  //---> Check if employee exists already.
  const existingEmployee = await prisma.employee.findUnique({
    where: { email },
  });

  if (!existingEmployee) {
    throw catchError(StatusCodes.BAD_REQUEST, "Invalid credentials");
  }

  //----> Check for the correctness of the employee password.
  const isValid = await bcrypt.compare(password, existingEmployee.password);

  if (!isValid) {
    throw catchError(StatusCodes.BAD_REQUEST, "Invalid credentials");
  }

  //----> Hash the new password.
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  employee.password = hashedPassword;

  delete employee.newPassword;

  //----> Make sure the date has the proper data type.
  const birthDate = employee.birthDate;

  if (typeof birthDate === "string") {
    employee.birthDate = new Date(birthDate);
  } 

  //----> Store the new password in the database.

  const updatedEmployee = await prisma.employee.update({
    where: { email },
    data: { ...employee },
  });

  //----> Make a employee object information.
  const employeeInfo: EmployeeInfo = {
    id: updatedEmployee.id,
    fullName: updatedEmployee.fullName,
    userType: updatedEmployee.userType,
    message: "Password is changed successfully, please login.",
  };

  //----> Send the employee information to client.
  res.status(StatusCodes.OK).json(employeeInfo);
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

  if (typeof birthDate === "string") {
    signUpEmployee.birthDate = new Date(birthDate);
  }

  //----> Save the employee.
  const savedEmployee = await prisma.employee.create({
    data: { ...signUpEmployee },
  });

  //----> Employee info
  const employeeEmployeeInfo: EmployeeInfo = {
    id: savedEmployee.id,
    fullName: savedEmployee.fullName,
    userType: savedEmployee.userType,
    message: 'Employee successfully added.'
  };

  //----> Send the employee info to client.
  res.status(StatusCodes.CREATED).json(employeeEmployeeInfo);
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
  changePasswordOfEmployee,
  employeeLogin,
  employeeSignUp,
  profileOfEmployee,
  profileOfEmployeeById,
};
