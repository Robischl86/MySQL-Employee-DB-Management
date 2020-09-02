DROP DATABASE IF EXISTS employeeDB;

CREATE DATABASE employeeDB;

USE employeeDB;

CREATE TABLE employees (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    manager_status BOOLEAN,
    title VARCHAR(30) NOT NULL,
    department VARCHAR(30),
    salary DECIMAL(10,2) NOT NULL,
    manager VARCHAR(30),
    PRIMARY KEY (id)
);

INSERT INTO employees (first_name, last_name, manager_status, title, department, salary)
VALUES ("Levi", "Robischon", 1, "Manager", "Marketing", "90000");

INSERT INTO employees (first_name, last_name, manager_status, title, department, salary)
VALUES ("Tom", "Carter", 1, "Manager", "Sales", "90000");

INSERT INTO employees (first_name, last_name, manager_status, title, department, salary)
VALUES ("Jane", "Miller", 1, "Manager", "Engineering", "90000");

INSERT INTO employees (first_name, last_name, manager_status, title, department, salary)
VALUES ("Mari", "Hernandez", 1, "Manager", "Finance", "90000");

INSERT INTO employees (first_name, last_name, manager_status, title, department, salary)
VALUES ("Ken", "Williams", 1, "Manager", "Legal", "90000");