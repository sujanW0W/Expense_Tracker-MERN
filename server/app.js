require("dotenv").config()
require("express-async-errors")

const mysql = require("mysql")

const express = require("express")
const app = express()

app.use(express.json())

const usersRoute = require("./routes/usersRoute")
const transactionsRoute = require("./routes/transactionsRoute")

const notFound = require("./middlewares/notFound")
const errorHandler = require("./middlewares/errorHandler")
const auth = require("./middlewares/auth")

//DB
const { connectDB, createDB } = require("./DB/connectDB")
const { createTable, createTable2 } = require("./model/createTables")

app.get("/", (req, res) => res.send("Welcome to The Expense Tracker MERN"))

app.get("/createDB", async (req, res) => {
    await createDB()
    res.send("Database Created Successfully.")
})

app.get("/createUser", createTable)
app.get("/createExpense", createTable2)

//routes
app.use("/api/v1/users", usersRoute)
app.use("/api/v1/trans", auth, transactionsRoute)

app.use(notFound)
app.use(errorHandler)

//middlewares

const port = process.env.PORT || 5000

const start = async () => {
    try {
        //Connection to DB
        // connectDB(process.env.MONGO_URI)
        await connectDB()

        app.listen(port, () => {
            console.log(`Server is listening on port ${port}`)
        })
    } catch (error) {
        console.log("ERROR.")
    }
}

start()
