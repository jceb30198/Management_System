DROP DATABASE IF EXISTS employee_managerDB;
CREATE DATABASE employee_managerDB;

USE employee_managerDB;

CREATE TABLE department (
    id INT,
    name VARCHAR(30),
    PRIMARY KEY (id)
);

CREATE TABLE role (
    id INT,
    title VARCHAR(30),
    salary DECIMAL(10,2),
    PRIMARY KEY (id)
);

CREATE TABLE employee (
    id INT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT,
    PRIMARY KEY (id)
);