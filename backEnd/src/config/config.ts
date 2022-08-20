const dotenv = require("dotenv");
dotenv.config();

const DB_USERNAME = process.env.DB_USERNAME || "";
const DB_PASSWORD = process.env.DB_PASSWORD || "";
const DB_HOST = process.env.DB_HOST || "";
const DB_DATABASE = process.env.DB_DATABASE || "";
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const REDIS_HOST = process.env.REDIS_HOST || "localhost";
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || "";
const REDIS_URL = process.env.REDIS_URL || "";

const PORT = process.env.PORT || 8000;

export const config = {
    mysql: {
        user: DB_USERNAME,
        password: DB_PASSWORD,
        host: DB_HOST,
        database: DB_DATABASE,
    },
    redis: {
        port: REDIS_PORT,
        host: REDIS_HOST,
        url: REDIS_URL,
        password: REDIS_PASSWORD,
    },
    server: {
        port: PORT,
    },
};
