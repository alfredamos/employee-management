import {PrismaClient} from "@prisma/client";

let db: PrismaClient;

declare global {
    var __db: PrismaClient | undefined;
}

db = global.__db;

export {db}