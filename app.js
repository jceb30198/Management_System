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
    if (err) throw err;
    console.log("Connected\n");
    console.log(line);
    begin();
});

const line = "--------------------------------------------------";

function begin() {
    inquirer.prompt({
        type: "list",
        name: "task",
        message: "What do you need help with?",
        choices: ["Add Department", "Add Employee", "Add Role", "View Department(s)", "View or Update Employee(s)", "View Role(s)", "Remove Department", "Remove Employee", "Remove Role", "Shutdown"]
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
            case "View or Update Employee(s)":
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
        name: "name",
        message: "What is the name of the new department?"
    }).then((res) => {
        let query = "INSERT INTO department SET ?";
        connection.query(query, { name: res.name }, (err, res) => {
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
];

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
    inquirer.prompt({
        type: "list",
        name: "choice",
        message: "Would you like to view or update employees?",
        choices: ["View", "Update"]
    }).then((res) => {
        if (res.choice === "View") {
            let query = "SELECT employee.first_name AS First_Name, employee.last_name AS Last_Name, department.name AS Department, role.title AS Title, role.salary AS Salary FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id";
            connection.query(query, (err, response) => {
                if (err) throw err;
                console.table(response);
                console.log(line)
                begin();
            });
        }
        else {
            updateEmployee();
        }
    });
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

function removeDepartment() {
    let sql = "SELECT * FROM department";
    connection.query(sql, (err, res) => {
        const deleteDepArr = [];
        for (let i = 0; i < res.length; i++) {
            deleteDepArr.push(res[i].name);
        };
        inquirer.prompt({
            type: "list",
            name: "name",
            message: "Which department would you like to delete?",
            choices: deleteDepArr
        }).then((data) => {
            let query = "DELETE FROM department WHERE department.name = ?";
            connection.query(query, data.name, (err, response) => {
                if (err) throw (err);
                console.log(`Department Removed\n${line}`);
                begin();
            });
        });
    });
};

function removeEmployee() {
    let sql = "SELECT employee.first_name, employee.last_name FROM employee";
    connection.query(sql, (err, res) => {
        const deleteEmployeeArr = [];
        for (let i = 0; i < res.length; i++) {
            let name = res[i].first_name + " " + res[i].last_name;
            deleteEmployeeArr.push(name);
        };
        inquirer.prompt({
            type: "list",
            name: "name",
            message: "Which employee would you like to delete?",
            choices: deleteEmployeeArr
        }).then((data) => {
            let query = "DELETE FROM employee WHERE (employee.first_name, employee.last_name) = (?)";
            let splitArr = [(data.name.split(" "))]; 
            connection.query(query, splitArr, (err, response) => {
                if (err) throw err;
                console.log(`Employee Removed\n${line}`)
                begin();
            })
        })
    })
};

function removeRole() {
    let sql = "SELECT role.title FROM role";
    connection.query(sql, (err,res) => {
        const deleteRoleArr = [];
        for (let i = 0; i < res.length; i++) {
            deleteRoleArr.push(res[i].title);
        };
        inquirer.prompt({
            type: "list",
            name: "title",
            message: "Which role would you like to delete?",
            choices: deleteRoleArr
        }).then((data) => {
            let query = "DELETE FROM role WHERE role.title = ?";
            connection.query(query, data.title, (err, response) => {
                if (err) throw err;
                console.log(`Role Removed\n${line}`);
                begin();
            })
        });
    });
};


function updateEmployee() {
    let sql = "SELECT employee.first_name, employee.last_name, role.title FROM employee INNER JOIN role ON employee.role_id = role.id";
    connection.query(sql, (err, res) => {
        const updateEmployeeArr = [];
        const updateRoleArr = [];
        for (let i = 0; i < res.length; i++) {
            let name = res[i].first_name + " " + res[i].last_name;
            updateRoleArr.push(res[i].title);
            updateEmployeeArr.push(name);
        }
        console.log(updateRoleArr);
        inquirer.prompt([
        {
            type: "list",
            name: "name",
            message: "Which employee would you like to update?",
            choices: updateEmployeeArr
        },
        {
            tpye: "list",
            name: "title",
            message: "Which role would you like the employee to have now?",
            choices: updateRoleArr
        }
        ]).then((data) => {
            begin();
    })
})};