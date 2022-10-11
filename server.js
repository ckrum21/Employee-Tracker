const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "092100Dance",
  database: "employees_db",
});

//start

const start = () => {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do? ",
        choices: [
          "View all employees",
          "View all departments",
          "View all roles",
          "Add employee",
          "Add department",
          "Add role",
          "Quit",
        ],
        name: "choice",
      },
    ])
    .then((response) => {
      
      switch (response.choice) {
        case 'View all employees':
          viewAllEmployees();
          break;
        case 'View all departments':
          viewAllDepartments();
          break;
        case 'View all roles':
          viewAllRoles();
          break;
        case 'Add employee':
          addEmployee();
          break;
        case 'Add department':
          addDepartment();
          break;
        case 'Add role':
          addRole();
          break;
        case 'Quit':
          connection.end();
          break;
        default:
          throw new Error('invalid initial user choice');
      }
    });
};

connection.connect((err) => {
  if (err) throw err;
  // console.log(`connected as id ${connection.threadId}`);
  console.log('Welcome to Employee Tracker');
  start();
});

//View all employees

const viewAllEmployees = () => {
  
  const query = `
  SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, salary, IFNULL(concat(m.first_name, ' ', m.last_name), 'N/A') AS manager
  FROM employee e
  LEFT JOIN employee m
  ON m.id = e.manager_id
  JOIN role
  ON e.role_id = role.id
  JOIN department
  ON role.department_id = department.id;`
    
  connection.query(
    query,
    (err, results) => {
      if (err) throw err;
      console.log('\n');
      console.table(results);
      start();
  })
}

//View All Departments

const viewAllDepartments = () => {
  const query = `SELECT department.id AS "Department ID", department.name AS Department FROM employees_db.department`;
  connection.query(
    query,
    (err, results) => {
      if (err) throw err;
      console.log('\n');
      console.table(results);
      start();
  })
}

//View all roles

const viewAllRoles = () => {
  const query = `SELECT role.id AS "Role ID", role.title AS Role, role.salary AS Salary, role.department_id AS "Department ID" FROM employees_db.role`;
  connection.query(
    query,
    (err, results) => {
      if (err) throw err;
      console.log('\n');
      console.table(results);
      start();
  })
}

//add Employees

const addEmployee = async () => {
  
  connection.query('Select * FROM role', async (err, roles) => {
    if (err) throw err; 
    
    connection.query('Select * FROM employee WHERE manager_id IS NULL', async (err, managers) => {
      if (err) throw err; 

    managers = managers.map(manager => ({name:manager.first_name + " " + manager.last_name, value: manager.id}));
    managers.push({name:"None"});

    const responses = await inquirer
      .prompt([
        {
          type: "input",
          message: "What is the employee's first name? ",
          name: "first_name"
        },
        {
          type: "input",
          message: "What is the employee's last name? ",
          name: "last_name"
        },
        {
          type: "list",
          message: "What is the employee's role? ",
          choices: roles.map(role => ({name:role.title, value: role.id})),
          name: "role_id"
        },
        {
          type: "list",
          message: "Who is the employee's manager? ",
          choices: managers,
          name: "manager_id"
        }
      ])
    
      if (responses.manager_id === "None") {
        responses.manager_id = null;
      }

    connection.query(
        'INSERT INTO employee SET ?',
        {
          first_name: responses.first_name,
          last_name: responses.last_name,
          role_id: responses.role_id,
          manager_id: responses.manager_id
        },
        (err, res) => {
          if (err) throw err;
          console.log("New employee added.\n");
          start();
        }
    )
  })
})
}

//Add Department

const addDepartment = async () => {
  const response = await inquirer
    .prompt([
      {
        name: 'newDepartment',
        type: 'input',
        message: 'What is the new department name? '
      }
    ])
    
    connection.query(
      'INSERT INTO employees_db.department SET ?',
      {
        name: response.newDepartment,
      },
      (err) => {
        if (err) throw err;
        console.log('New department added successfully!\n')
        start();
      }
    )
}

const getDepartments = () => {
  return new Promise( (resolve, reject) => {
  
    const query = `SELECT * FROM employees_db.department`;
    connection.query(
      query,
      (err, results) => {
        if (err) reject(err);
        resolve(results);
  })
})
}

//Add Role

const addRole = async () => {
  
  const departments = await getDepartments();
  const responses = await inquirer
  .prompt([
    {
      name: 'title',
      type: 'input',
      message: 'What is the new role? ',
    },
    {
      name: 'salary',
      type: 'number',
      message: "What is the role's salary? ",
    },
    {
      name: 'department',
      type: 'list',
      choices: departments.map(department => department.name),
      message: 'What department is the role in? '
    }
  ])
  
  departments.forEach(department => {
    if (department.name === responses.department) {
      responses.department = department.id;
    }
  });

  connection.query(
    'INSERT INTO employees_db.role SET ?',
    {
      title: responses.title,
      salary: responses.salary,
      department_id: responses.department,
    },
    (err) => {
      if (err) throw err;
      console.log('New role added successfully!\n')
      start();
  })
}
