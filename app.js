// Dependencies
const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console.table");

// MySQL connection
const connection = mysql.createConnection({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "password",
    database: "employee_managerDB"
})

connection.connect((err)=> {
    if (err) throw err;
    console.log("Connected\n");
})

// Add department/role/employee

// View department/role/employee

// Remove department/role/employee

// Update roles of employees