import Joi from "joi";
import {Employee} from "../models/employee.model";

const employeeSchema = Joi.object({
    fullName: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
});

export const employeeValidation = (employee: Employee) => {
    const {fullName, email, phone, } = employee;

    return employeeSchema.validate({fullName, email, phone});
}