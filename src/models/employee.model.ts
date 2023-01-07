import {Gender} from "./gender.model";
import { UserType } from "@prisma/client";

export class Employee {
    id?: string;
    fullName!: string;
    email!: string;
    phone!: string;
    birthDate!: Date;
    gender!: Gender;
    password!: string;
    newPassword?: string;
    departmentId!: string;
    userType!: UserType;

}