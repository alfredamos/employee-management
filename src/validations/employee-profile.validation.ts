import Joi from "joi";
import { Employee } from "../models/employee.model";

const employeeSchema = Joi.object().keys({
  fullName: Joi.string().required(),
  email: Joi.string().required().email(),
  phone: Joi.string().required(),
  password: Joi.string().required(),
  newPassword: Joi.string().required(),
  departmentId: Joi.string().required(),
});

export const employeeProfileValidation = (employee: Employee) => {
  const { fullName, email, phone, departmentId, password, newPassword } = employee;  

  return employeeSchema.validate(
    {
      fullName,
      email,
      phone,
      departmentId,
      password,
      newPassword,
    },
    { abortEarly: false }
  );
};
