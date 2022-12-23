const { mysqlConnection } = require("../DB/connectDB")

const createTable = (req, res) => {
    let sql = `CREATE TABLE user(
        id int AUTO_INCREMENT,
        fullName VARCHAR(50),
        age int,
        userName VARCHAR(15),
        email VARCHAR(30),
        password VARCHAR(30),
        PRIMARY KEY(id)
    )`

    mysqlConnection.query(sql, (err) => {
        if (err) throw err

        console.log("Table Created Successfully.")
        res.send("User Table Created.")
    })
}

//THis is a middlware, so it needs req,res,next as parameters
const createTable2 = (req, res) => {
    let sql = `Create Table expenses(
        id int,
        name VARCHAR(50),
        amount decimal(6,2),
        date Date,
        createdBy int,
        PRIMARY KEY(id),
        FOREIGN KEY(createdBy) REFERENCES user(id)
        )                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       `

    mysqlConnection.query(sql, (err) => {
        if (err) throw err
        console.log("Table2 Created Successfully.")
        res.send("Expense Table Created.")
    })
}

module.exports = { createTable, createTable2 }
