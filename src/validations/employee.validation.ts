import Joi from "joi";
import {Employee} from "../models/employee.model";

const employeeSchema = Joi.object({
    fullName: Joi.string().required(),
    password: Joi.string().required(),
    departmentId: Joi.string().required(),
    email: Joi.string().required().email(),
    phone: Joi.string().required(),
});

export const employeeValidation = (employee: Employee) => {
    const {
        fullName, 
        email, 
        phone, 
        departmentId,
        password,
    } = employee;

    return employeeSchema.validate({
        fullName, 
        email, 
        phone,
        departmentId,
        password
    }, {abortEarly: false});
}