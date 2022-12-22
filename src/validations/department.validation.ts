import Joi from "joi";
import {Department} from "../models/department.model";

const departmentSchema = Joi.object({
    name: Joi.string().required()
});

export const departmentValidation = (department: Department) => {
    const {name} = department;

    return departmentSchema.validate({name});
}