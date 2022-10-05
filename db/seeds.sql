INSERT INTO department (department_name)
VALUES ("Engineer"),
       ("Finance"),
       ("Legal"),
       ("Sales");

SELECT * FROM department;

INSERT INTO roles(title, salary, department_id)
VALUES  ("Sales Lead", "100000", 1),
        ("Salesperson","80000", 1),
        ("Lead Engineer", "150000", 2),
        ("Software Engineer", "120000", 2),
        ("Account Manager", "160000", 3),
        ("Accountant", "125000", 3),
        ("Legal Team Lead", "250000", 4),
        ("Lawyer", "190000", 4);
    
SELECT * FROM roles;

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Doe", 1, NULL),
       ("Mike", "Chan", 2, 1),
       ("Ashley", "Rodriguez", 3, NULL);

SELECT * FROM employee;