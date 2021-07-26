const inquirer = require('inquirer');
const mysql = require('mysql2');
require('dotenv').config();

//const cTable = require('console.table');
//https://www.npmjs.com/package/console.table;  console.table(data);
//Use dotenv.config and install  in Package for env-sensitive info protect
// and include files like nm,env in .gitignore
//Skeleton based on topSongsCode.js
//https://javascript.plainenglish.io/querying-sql-server-in-node-js-using-async-await-5cb68acf2144

const connection = mysql.createConnection({

 host: 'localhost',
 port:3306,
 database:'employdb',
 password:process.env.DB_PASSWORD,
 user:'root'
        
});
connection.connect();
//Welcome script

console.log("******************************************************")
console.log("*                                                       *")
console.log("*                    WELCOME TO                        *")
console.log("*                 EMPLOYEE MANAGEMENT                  *")
console.log("*                                                       *")
console.log("*************************************************************")
 
function runQuery() {
 inquirer.prompt(
    {
        type: 'list',            
        name: 'option',
        message: 'Query any options',
        choices: [
        'ViewDepts',  'ViewRoles',   'ViewEmployees',
        'AddDepartment',  'AddRole',   'AddEmployee',
        'UpdateEmployeeRole' ,
        // 'DelDept',       //  'DelRole',        // 'DelEmp',       // Calculation
        'End'
        ]
        })

 .then(answer => {

    switch (answer.option) {

    case "ViewDepts":
          ViewDepartments();
          break;
    case "ViewRoles":
          ViewRoles();
          break;
    case "ViewEmployees":
          ViewEmployees();
          break;
    case "AddDepartment":
          AddDepartment();
          break;
    case "AddRole":
          AddRole();
          break;
    case "AddEmployee":
          AddEmployee();
          break;
    case "UpdateEmployeeRole":
          UpdateFn();
           break;              
    
    case "End":
         connection.end();
         console.log('Exit app');
         break;
            }
        })
}

function ViewDepartments() {
connection.query(
    'SELECT * FROM Department',
     (err, res) => {
     if (err) {
                throw err;
            }
     //outputs in table
     console.table(res)
     runQuery();
        }
    )
}

function ViewRoles() {
connection.query(
    'SELECT work.title as Role_title, work.salary as Salary , dept.name as DepartmentName from Role work left join department as dept on dept.id = work.department_id',
    (err, res) => {    
    if (err) {
                throw err;
            }
    console.table(res)
    runQuery();
        }
    )
}

function ViewEmployees() {
connection.query(
   'SELECT empA.id as EmployeeID, concat(empA.first_name," ",empA.last_name ) as EmployeeName , work.title as Role_Title, work.salary as Salary,dept.name as Department_Name,concat(empB.first_name," ",empB.last_name) as ManagerCadre from employdb.employee as empA left join employdb.employee as empB on empB.id=empA.manager_id left join employdb.Role as work on empA.role_id=work.id left join employdb.department as dept on dept.id = work.department_id',
    (err, res) => {
    if (err) {
           throw err;
            }
    console.table(res)
    runQuery();
        }
    )
}

function AddDepartment() {
inquirer.prompt([
        {
        type: 'input',
        name: 'department',
        message: 'Add a dept name:'
        }

    ]).then(answer => {
        console.log(answer);
        connection.query('INSERT INTO department SET?', { name:answer.department },
         (err, res) => {
        if (err) throw err;
        console.log('Dept added ;View  Depts to confirm')
        runQuery();
        });
    });
}

function AddRole() 
{  
connection.promise().query ("SELECT * FROM Department")
    .then((res) => {         
     return res[0].map(dept => {
     return {
         name: dept.name,
         value: dept.id
             }
            })
        })
        .then((division) => {
        return inquirer.prompt([

        {
            type: 'input',
            name: 'role',
            message: 'Add  role:'
        },

        {
            type: 'input',
            name: 'salary',
            message: 'Enter salary:'
         },

         {
                    type: 'list',
                    name: 'depts',
                    choices: division,
                    message: 'Enter dept.'
         }
            ])
        })

    .then(answer => {
            console.log(answer);
            return connection.promise().query('INSERT INTO role SET ?', { title: answer.role, salary: answer.salary, department_id: answer.depts });
        })
    .then(res => {
            console.log('Run query Viewrole to verify the newly added role')
            runQuery();

       })
        .catch(err => {
            throw err
       });
}


function Roleaddupdatemanager() {
    return connection.promise().query("SELECT * FROM employee ")
    .then(res => {
     return res[0].map(manager => {
     return {
                    name: `${manager.first_name} ${manager.last_name}`,
                    value: manager.id,
                }
            })
        })
}

function RoleforAddupdatefeature() {
    return connection.promise().query("SELECT * FROM role")
    .then(res => {
    return res[0].map(role => {
    return {
                    name: role.title,
                    value: role.id
                }
            })
        })
}


async function AddEmployee() {
const ManagerDEsignation = await Roleaddupdatemanager();
inquirer.prompt([
        {
            name: "firstname",
            type: "input",
            message: "Firstname please "
        },
        {
            name: "lastname",
            type: "input",
            message: "lastname plaese "
        },
        {
            name: "role",
            type: "list",
            message: "Enter role? ",
            choices: await RoleforAddupdatefeature()
        },
        {
            name: "manager",
            type: "list",
            message: "Enter mangers name?",
            choices: ManagerDEsignation
        }
    ]).then(function (res) {
        let roleId = res.role
        let managerId = res.manager
        console.log({managerId});
        connection.query("INSERT INTO Employee SET ?",
            {
                first_name: res.firstname,
                last_name: res.lastname,
                manager_id: managerId,
                role_id: roleId

            }, function (err) {
                if (err) throw err
                console.table(res)
                runQuery();
            })
    })
}

function UpdateFn() {
    connection.promise().query('SELECT *  FROM employee')
        .then((res) => {
            return res[0].map(employee => {
                return {
                    name: employee.first_name,
                    value: employee.id
                }
            })
        })
.then(async (employeeList) => {
            return inquirer.prompt([
                {
                    type: 'list',
                    name: 'employeeListId',
                    choices: employeeList,
                    message: 'Name an employee (firstname  to update):.'
                },
                {
                    type: 'list',
                    name: 'roleId',
                    choices: await RoleforAddupdatefeature(),
                    message: 'Change a role now.'
                }
            ])
        })
.then(answer => {
            console.log(answer);
            return connection.promise().query("UPDATE employee SET  role_id = ? WHERE id = ?",
                    [
                        answer.roleId,
                        answer.employeeListId,
                    ],
            );
        })
 .then(res => {
           console.log('View employee table  and get to the emp first name to confirm the update')
            runQuery();
        })
        .catch(err => {
            throw err
        });

}
runQuery();
