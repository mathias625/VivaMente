<<<<<<< HEAD
const { PrismaClient } = require("@prisma/client");
const { PrismaMariaDb } = require("@prisma/adapter-mariadb");

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL não foi configurada no arquivo .env");
}

const databaseUrl = new URL(process.env.DATABASE_URL);

const adapter = new PrismaMariaDb({
    host: databaseUrl.hostname,
    port: Number(databaseUrl.port || 3306),
    user: decodeURIComponent(databaseUrl.username),
    password: decodeURIComponent(databaseUrl.password),
    database: databaseUrl.pathname.replace(/^\//, ""),
    connectionLimit: 10,
});

const prisma = new PrismaClient({
    adapter,
=======
require("dotenv").config();

const {
    PrismaClient
} = require("@prisma/client");

const {
    PrismaMariaDb
} = require("@prisma/adapter-mariadb");

const url = new URL(process.env.DATABASE_URL);

const adapter = new PrismaMariaDb({
    host: url.hostname,
    port: Number(url.port || 3306),
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: decodeURIComponent(url.pathname.replace("/", "")),
    connectionLimit: 5
});

const prisma = new PrismaClient({
    adapter
>>>>>>> bcff094e59fa8390c7a153b686f7dbee3928a523
});

module.exports = prisma;