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

app.use((req, res) =>{
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});