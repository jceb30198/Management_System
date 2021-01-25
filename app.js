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
});

connection.connect((err) => {
    if (err) {
        throw err;
    }
    else {
        console.log("Connected\n");
        begin();
    }
});

const line = "--------------------------------------------------";

function begin() {
    inquirer.prompt({
        type: "list",
        name: "task",
        message: "What do you need help with?",
        choices: ["Add Department", "Add Employee", "Add Role", "View Department(s)", "View Employee(s)", "View Role(s)", "Remove Department", "Remove Employee", "Remove Role", "Shutdown"]
    }).then((res) => {
        switch (res.task) {
            case "Add Department":
                addDepartment();
                break;
            case "Add Employee":
                addEmployee();
                break;
            case "Add Role":
                addRole();
                break;
            case "View Department(s)":
                viewDepartment();
                break;
            case "View Employee(s)":
                viewEmployee();
                break;
            case "View Role(s)":
                viewRole();
                break;
            case "Remove Department":
                removeDepartment();
                break;
            case "Remove Employee":
                removeEmployee();
                break;
            case "Remove Role":
                removeRole();
                break;
            default:
                console.log(`Goodbye\n${line}`);
                connection.end();
        };
    })
};

function addDepartment() {
    inquirer.prompt({
        type: "input",
        name: "newDepartment",
        message: "What is the name of the new department?"
    }).then((res) => {
        let query = "INSERT INTO department SET ?";
        connection.query(query, { name: res.newDepartment }, (err, res) => {
            if (err) throw err;
            console.log(`Department Added\n${line}`);
            begin();
        })
    })
};

const addEmployeeArr = [
    {
        type: "input",
        name: "firstName",
        message: "Please enter the employee's first name:"
    },
    {
        type: "input",
        name: "lastName",
        message: "Please enter the employee's last name:"
    },
    {
        type: "input",
        name: "roleID",
        message: "Please enter the employee's role ID:"
    },
    {
        type: "input",
        name: "managerID",
        message: "Please enter the employee's manager ID:"
    }
];


function addEmployee() {
    inquirer.prompt(addEmployeeArr).then((res) => {
        let query = "INSERT INTO employee SET ?";
        connection.query(query, {
            first_name: res.firstName,
            last_name: res.lastName,
            role_id: res.roleID,
            manager_id: res.managerID
        }, (err, res) => {
            if (err) throw err;
            console.log(`Employee Added\n${line}`)
            begin();
        })
    })
};

const addRoleArr = [
    {
        type: "input",
        name: "title",
        message: "What is the title of the role?"
    },
    {
        type: "input",
        name: "salary",
        message: "How much does this role make in salary?"
    },
    {
        type: "input",
        name: "departmentID",
        message: "Please enter this role's department ID:"
    }
]

function addRole() {
    inquirer.prompt(addRoleArr).then((res) => {
        let query = "INSERT INTO role SET ?";
        connection.query(query, {
            title: res.title,
            salary: res.salary,
            department_id: res.departmentID
        }, (err, res) => {
            if (err) throw err;
            console.log(`Role Added\n${line}`);
            begin();
        })
    })
};


function viewDepartment() {
    let query = "SELECT department.name AS Department FROM department"
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        console.log(line);
        begin();
    })
};

function viewEmployee() {
    let query = "SELECT employee.first_name AS First_Name, employee.last_name AS Last_Name, department.name AS Department, role.title AS Title, role.salary AS Salary FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id";
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        console.log(line)
        begin();
    })
};

function viewRole() {
    let query = "SELECT role.title AS Title, role.salary AS Salary, department.name AS Department FROM role INNER JOIN department ON role.department_id = department.id";
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        console.log(line);
        begin();
    })
};


/*
What would you like to do? {
    Add department/role/employee

    View department/role/employee

    Remove department/role/employee

    Update roles of employees
}
*/