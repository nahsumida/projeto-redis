import mysql, { connectionOptions } from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

const access: connectionOptions = {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
};

export const conn = mysql.createconnection(access);