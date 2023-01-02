"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Employee = void 0;
const gender_model_1 = require("./gender.model");
class Employee {
    constructor() {
        this.id = "";
        this.fullName = "";
        this.email = "";
        this.phone = "";
        this.birthDate = new Date();
        this.gender = gender_model_1.Gender.Male;
    }
}
exports.Employee = Employee;
