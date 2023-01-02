import Joi from "joi";
import { Employee } from "../models/employee.model";

const employeeSchema = Joi.object({  
  password: Joi.string().required(), 
  email: Joi.string().required().email(),  
});

export const employeeLoginValidation = (employee: Employee) => {
  const {email, password } = employee;

  return employeeSchema.validate({    
    email,  
    password,
  }, {abortEarly: false});
};
