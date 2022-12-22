import {Gender} from "./gender.model";

export class Employee {
    id: string = "";
    fullName: string = "";
    email: string = "";
    phone: string = "";
    birthDate: Date = new Date();
    gender: Gender = Gender.Male;
    departmentId?: string;

}