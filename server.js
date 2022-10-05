const express = require('express');
const mysql = require('mysql12');
const inquirer = require('inquirer');
const cTable = require('console.table');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({extended: false}));
app.use (express.json());

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '092100Dance',
        database: 'employeeTracker_db'
    },
    console.log('Connected to the employeeTracker_db.')
);

//add content
PoolConnection.connect(function(err) {
    if (err) throw err 
    console.log("Connected as Id" + Connection.threadId)
    startPrompt();
});

function startPrompt() {
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View All Employees",
                "Add Employee",
                "Update Employee Role",
                "View All Roles",
                "Add Role",
                "View All Departments",
                "Add Department"
            ]
        }
    ]).then(function(val){
        switch(val.choice) {
            case "View All Employees":
                viewAllEmployees();
            break;

            case "Add Employee":
                addEmployee();
            break;
            
            case "Update Employee Role":
                updateEmployeeRole();
            break;

            case "View All Roles":
                viewAllRoles();
            break;

            case "Add Role":
                addRole();
            break;

            case "View All Departments":
                viewAllDepartments();
            break;

            case "Add Department":
                addDepartment();
            break;
        }
    })
}

function viewAllEmployees (){
    connection.query("SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id;",
    function(err, res) {
        if (err) throw err
        console.table(res)
        startPrompt()
    })
}

function addEmployee() {
    inquirer.prompt([
        {
            name: "firstname",
            type: "input",
            message: "Enter employee's first name"
        },
        {
            name: "lastname",
            type: "input",
            message: "Enter empolyee's last name"
        },
        {
            name: "role",
            type: "list",
            message: "what is the employee's role?",
            choices: selectRole()
        },
        {
            name: "choice",
            type:"rawlist",
            message: "what is the manager's name?",
            choices: selectManager()
        }
    ]). then(function (val) {
        var role_id = selectRole(). indexOf(vale.role) + 1
        var manager_id = selectManager().indexOf(val.choice) + 1
        connection.query("INSERT INTO employee SET ?",
        {
            first_name: val.first_name,
            last_name: val.last_name,
            manager_id: manager_id,
            role_id: role_id

        }, function(err){
            if (err) throw err
            console.table(val)
            startPrompt()
        })
    })
}


app.use((req, res) =>{
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});