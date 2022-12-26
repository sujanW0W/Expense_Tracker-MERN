// const mongoose = require("mongoose")

// const connectDB = (uri) => {
//     return mongoose.connect(uri)
// }

// module.exports = connectDB

const mysql = require("mysql")
const { Sequelize } = require("sequelize")

const mysqlConnection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "expense_tracker",
    password: "hello_world",
})

const connectDB = () => {
    mysqlConnection.connect((err) => {
        if (err) console.log(err)
        console.log("Connected to Mysql Database!")
    })
}

const createDB = () => {
    let sql = "CREATE DATABASE expense_tracker"
    mysqlConnection.query(sql, (err) => {
        if (err) throw err

        console.log("Database Created.")
    })
}

//Sequelize
const sequelize = new Sequelize(
    "expense_tracker_SequelizeTest",
    "root",
    "hello_world",
    {
        host: "localhost",
        dialect: "mysql",
    }
)

module.exports = { mysqlConnection, connectDB, createDB, sequelize }
