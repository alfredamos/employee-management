import { UserType } from "@prisma/client";

export class EmployeeInfo{
    id!: string;
    fullName!: string;
    userType!: UserType;
    token?: string;
    message?: string;

}