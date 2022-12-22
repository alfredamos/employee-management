import express from "express";
import cors from "cors";
import dotenv from "dotenv";
require("express-async-errors");

dotenv.config();

import departmentRoute from "./src/routes/department.route";
import employeeRoute from "./src/routes/employee.route";

import {notFoundRouteMiddleware} from "./src/middleware/not-found-route.middleware";
import {errorHandlerMiddleware} from "./src/middleware/error-handler.middleware";

const app = express();
const Port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

app.use('/api/departments', departmentRoute);
app.use('/api/employees', employeeRoute);

app.use(notFoundRouteMiddleware);
app.use(errorHandlerMiddleware);

app.listen(Port, () => console.log(`App is listening on ${Port}...`));