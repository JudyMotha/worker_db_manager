DROP DATABASE IF EXISTS employdb;
CREATE DATABASE employdb;
USE employdb; 

CREATE TABLE Department (
    id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR (30)NOT NULL,    
);

CREATE TABLE Role (
    id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30)NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT,   
    FOREIGN KEY (department_id) REFERENCES Department(id)
);

CREATE TABLE Employee (
    id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR (30)NOT NULL,
    role_id INTEGER,
    manager_id INTEGER,
    FOREIGN KEY (role_id) REFERENCES Role(id),
    FOREIGN KEY (manager_id) REFERENCES employee(id)
    
);
