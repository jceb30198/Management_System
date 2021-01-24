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

connection.connect((err)=> {
    if (err) {
        throw err;
    }
    else {
        console.log("Connected\n");
        begin();
    }
});

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

                
                break;
            case "View Employee(s)":
                
                break;
            case "View Role(s)":
                
                break;
            case "Remove Department":
                
                break;
            case "Remove Employee":
                
                break;
            case "Remove Role":
                
                break;
            default:
                console.log(`Goodbye\n--------------------------------------------------`);
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
        connection.query(query, {name: res.newDepartment}, (err,res) => {
            if (err) throw err;
            console.log(`Department Added\n--------------------------------------------------`);
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
            console.log(`Employee Added\n--------------------------------------------------`)
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
            console.log(`Role Added\n--------------------------------------------------`);
            begin();
        })
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