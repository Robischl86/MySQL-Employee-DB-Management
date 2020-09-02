var mysql = require("mysql");
var inquirer = require("inquirer");
const { stringify } = require("querystring");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "employeeDB"
});

connection.connect(function(err) {
  if (err) throw err;
  runSearch();
});

function runSearch() {
  connection.query("SELECT * FROM employees", function(err, results) {
  if (err) throw err;  
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "View All Managers",
        "View All Employees By Department",
        "View All Employees By Manager",
        "Add Employee",
        "Remove Employee",
        "Update Employee Income",
        "Update Employee Manager",
        "Update Employee Department",
        "Update Employee Role"
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
      case "View All Employees":
        viewAllEmployees();
        break;

      case "View All Managers":
        displayManagers();
        break;

      case "View All Employees By Department":
        departmentSearch();
        break;
      
      case "View All Employees By Manager":
        managerSearch();
        break;

      case "Add Employee":
        addEmployee();
        break;

      case "Remove Employee":
        deleteEmployee();
        break;

      case "Update Employee Income":
        updateIncome();
        break;
      
      case "Update Employee Manager":
        updateManager();
        break;

      case "Update Employee Department":
        updateDepartment();
        break;

      case "Update Employee Role":
        updateRole();
        break;
      }
    });
  });
}

function viewAllEmployees() {
  console.log("Viewing All Employees");
  connection.query("SELECT * FROM employees", function(err, res) {
    if (err) throw err;
    for (let i = 0; i < res.length; i++) {
    console.log(res[i].id + " | " + res[i].first_name + " | " + res[i].last_name + " | " + res[i].title+ " | " + res[i].department+ " | " + res[i].salary+ " | " + res[i].manager);
    console.log("-----------------------------------");
    }
    runSearch();
  });
}

function displayManagers() {
  console.log("Viewing All Employees");
  connection.query("SELECT * FROM employees WHERE ?",
  { 
    manager_status: 1 
  },
   function(err, res) {
    if (err) throw err;
    for (let i = 0; i < res.length; i++) {
    console.log(res[i].id + " | " + res[i].first_name + " | " + res[i].last_name + " | " + res[i].title+ " | " + res[i].department+ " | " + res[i].salary+ " | " + res[i].manager);
    console.log("-----------------------------------");
    }
    runSearch();
  });
}

function departmentSearch() {
  // query the database for all employees
  connection.query("SELECT * FROM employees", function(err, results) {
    if (err) throw err;
    // Search for employees in the specific department you are searching
    inquirer
    .prompt({
      name: "department",
      type: "list",
      message: "What department would you like to search?",
      choices: function() {
        var departmentArray = [];
        for (let i = 0; i < results.length; i++) {
          departmentArray.push(results[i].department);
        }
        return departmentArray;
      }
    })
    .then(function(answer) {
      console.log(answer.song);
      connection.query("SELECT * FROM employees WHERE ?", { department: answer.department }, function(err, res) {
        for (let i = 0; i < res.length; i++) {
          console.log(
            res[i].id +
            " || Name: " +
              res[i].first_name + " " + res[i].last_name + 
              " || Title: " +
              res[i].title +
              " || Salary: " +
              res[i].salary +
              " || Manager: " +
              res[i].manager
          );
        }
        runSearch();
      });
    });
  })
}

function managerSearch() {
  // query the database for all employees
  connection.query("SELECT * FROM employees WHERE ?",
  {
    manager_status: 1
  },
  function(err, results) {
    if (err) throw err;
    // Search for employees in the specific department you are searching
    inquirer
    .prompt({
      name: "manager",
      type: "list",
      message: "Which manager would you like to search?",
      choices: function() {
        var managerArray = [];
        for (let i = 0; i < results.length; i++) {
          managerArray.push(results[i].first_name + " " + results[i].last_name);
        }
        return managerArray;
      }
    })
    .then(function(answer) {
      console.log(answer.song);
      connection.query("SELECT * FROM employees WHERE ?", { manager: answer.manager }, function(err, res) {
        for (let i = 0; i < res.length; i++) {
          console.log(
            res[i].id +
            " || Name: " +
              res[i].first_name + " " + res[i].last_name + 
              " || Title: " +
              res[i].title +
              " || Salary: " +
              res[i].salary +
              " || Department: " +
              res[i].department
          );
        }
        runSearch();
      });
    });
  })
}

function addEmployee() {
  connection.query("SELECT * FROM employees", function(err, results) {
    if (err) throw err;  
    inquirer.prompt([
      {
        name: "firstName",
        type: "input",
        message: "What is the employee's first name?"
      },
      {
        name: "lastName",
        type: "input",
        message: "What is the employee's last name?"
      },
      {
        name: "managerStatus",
        type: "confirm",
        message: "Is the employee a manager?"
      },
      
      {
        name: "title",
        type: "input",
        message: "What is the employee's title?"
      },
      {
        name: "department",
        type: "rawlist",
        message: "What is the employee's department?",
        choices: function() {
          var departmentArray = [];
          for (let i = 0; i < results.length; i++) {
            departmentArray.push(results[i].department);
          }
          return departmentArray;
        }
      },
      {
        name: "salary",
        type: "number",
        message: "What is the employee's salary?"
      },
      {
        name: "manager",
        type: "list",
        message: "Who is the employee's manager?",
        choices: function() {
          var managerArray = [""];
          for (let i = 0; i < results.length; i++) {
            if (results[i].manager_status == 1) {
              managerArray.push(results[i].first_name + " " + results[i].last_name);
            }
          }
          return managerArray;
        }
      }
      ]).then(function(response) {
        console.log(response.firstName + " || " + response.lastName + " || " + response.managerStatus + " || " + response.title + " || " + response.department + " || " + response.salary + " || " + response.manager);
        var query = connection.query(
          "INSERT INTO employees SET ?",
          {
            first_name: response.firstName,
            last_name: response.lastName,
            manager_status: response.managerStatus,
            title: response.title,
            department: response.department,
            salary: response.salary,
            manager: response.manager,
          },
          function(err, res) {
            if (err) throw err;
          }

        )
        runSearch();
      })
    });

}

function deleteEmployee() {
  connection.query("SELECT * FROM employees", function(err, results) {
    if (err) throw err;  
    inquirer.prompt([
      {
        name: "id",
        type: "number",
        message: "What is the employee's id number?"
      }
      ]).then(function(response) {
        connection.query(
          "DELETE FROM employees WHERE ?",
          [
            {
              id: response.id
            }
          ],
          function(err, res) {
            if (err) throw err;
            console.log(`The employee has been removed`);
            runSearch();
          }
        )
    })
  });
}

function updateIncome() {
  connection.query("SELECT * FROM employees", function(err, results) {
    if (err) throw err;  
    inquirer.prompt([
      // search employee by id number
      {
        name: "id",
        type: "number",
        message: "What is the employee's id number?"
      },
      {
        name: "salary",
        type: "number",
        message: "What is the employee's new salary?"
      },
    ]).then(function(response) {
        connection.query(
          "UPDATE employees SET ? WHERE ?",
          [
            {
              salary: response.salary
            },
            {
              id: response.id
            }
          ],

          function(err, res) {
            if (err) throw err;
            console.log(`Income for employee is now $${response.salary}`);
            runSearch();
          }
        )
    })
  });
}


function updateManager() {
  connection.query("SELECT * FROM employees", function(err, results) {
    if (err) throw err;  
    inquirer.prompt([
      {
        name: "id",
        type: "number",
        message: "What is the employee's id number?"
      },
      {
        name: "manager",
        type: "list",
        message: "Who is the employee's new manager?",
        choices: function() {
          var managerArray = [];
          for (let i = 0; i < results.length; i++) {
            if (results[i].manager_status == 1) {
              managerArray.push(results[i].first_name + " " + results[i].last_name);
            }
          }
          return managerArray;
        }
      }
      ]).then(function(response) {
        connection.query(
          "UPDATE employees SET ? WHERE ?",
          [
            {
              manager: response.manager
            },
            {
              id: response.id
            }
          ],
          function(err, res) {
            if (err) throw err;
            console.log(`The employee's manager is now ${response.manager}`);
            runSearch();
          }
        )
    })
  });
}


function updateDepartment() {
  connection.query("SELECT * FROM employees", function(err, results) {
    if (err) throw err;  
    inquirer.prompt([
      {
        name: "id",
        type: "number",
        message: "What is the employee's id number?"
      },
      {
        name: "department",
        type: "list",
        message: "What is the employee's new department?",
        choices: function() {
          var departmentArray = [];
          for (let i = 0; i < results.length; i++) {
            departmentArray.push(results[i].department);
          }
          return departmentArray;
        }
      }
      ]).then(function(response) {
        connection.query(
          "UPDATE employees SET ? WHERE ?",
          [
            {
              department: response.department
            },
            {
              id: response.id
            }
          ],
          function(err, res) {
            if (err) throw err;
            console.log(`The employee's department is now ${response.department}`);
            runSearch();
          }
        )
    })
  });
}

function updateRole() {
  connection.query("SELECT * FROM employees", function(err, results) {
    if (err) throw err;  
    inquirer.prompt([
      {
        name: "id",
        type: "number",
        message: "What is the employee's id number?"
      },
      {
        name: "title",
        type: "inpute",
        message: "What is the employee's new role?"
      }
      ]).then(function(response) {
        connection.query(
          "UPDATE employees SET ? WHERE ?",
          [
            {
              title: response.title
            },
            {
              id: response.id
            }
          ],
          function(err, res) {
            if (err) throw err;
            console.log(`The employee's job title is now ${response.title}`);
            runSearch();
          }
        )
    })
  });
}

