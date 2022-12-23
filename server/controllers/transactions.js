/*

const Transactions = require("../model/transactionSchema")
const { NotFound } = require("../errors/")

const getAllTransactions = async (req, res) => {
    const { userID } = req.users
    const trans = await Transactions.find({ createdBy: userID })

    if (trans.length === 0) throw new NotFound("No expenses Found.")

    res.status(200).json(trans)
}

const createTransaction = async (req, res) => {
    req.body.createdBy = req.users.userID
    const trans = await Transactions.create(req.body)

    res.status(201).json({ msg: `Expense '${trans.name}' added Successfully.` })
}

const getTransaction = async (req, res) => {
    const { userID } = req.users
    const { id: expenseID } = req.params
    const trans = await Transactions.findOne({
        createdBy: userID,
        _id: expenseID,
    })

    if (!trans) throw new NotFound(`Expense with id: ${expenseID} not Found.`)

    res.status(200).json(trans)
}

const updateTransaction = async (req, res) => {
    const {
        users: { userID },
        params: { id: expenseID },
    } = req
    const trans = await Transactions.findOneAndUpdate(
        { createdBy: userID, _id: expenseID },
        req.body,
        { new: true }
    )

    if (!trans) throw new NotFound(`Expense with id: ${expenseID} not Found.`)

    res.status(200).json(trans)
}

const deleteTransaction = async (req, res) => {
    const {
        users: { userID },
        params: { id: expenseID },
    } = req
    const trans = await Transactions.findOneAndDelete({
        createdBy: userID,
        _id: expenseID,
    })

    if (!trans) throw new NotFound(`Expense with id: ${expenseID} not Found.`)

    res.status(200).json(trans)
}

module.exports = {
    getAllTransactions,
    createTransaction,
    getTransaction,
    updateTransaction,
    deleteTransaction,
}

*/

//MySQL

const { mysqlConnection } = require("../DB/connectDB")

const getAllTransactions = (req, res) => {
    let sql = "SELECT * FROM EXPENSES"
    mysqlConnection.query(sql, (err, result) => {
        if (!err) {
            result = JSON.parse(JSON.stringify(result))

            if (result.length === 0)
                return res.status(404).json({ msg: "No expenses found." })

            res.status(200).json(result)
        } else throw err
    })
}

const createTransaction = async (req, res) => {
    const { id, name, amount, date, createdBy } = req.body

    if (!id || !name || !amount || !date || !createdBy)
        return res.status(400).json({ msg: "Enter data correctly." })

    const checkUser = async () => {
        let sql = `SELECT id FROM USER`

        await mysqlConnection.query(sql, (err, result) => {
            if (!err) {
                result = JSON.parse(JSON.stringify(result))
                const userIDs = []
                result.map((user) => {
                    userIDs.push(user.id)
                })

                if (userIDs.includes(createdBy)) checkExpenseID()
                else
                    return res.status(404).json({
                        msg: `User with id:${createdBy} does not exist.`,
                    })
            } else throw err
        })
    }

    const checkExpenseID = async () => {
        let sql = `SELECT id FROM EXPENSES`

        await mysqlConnection.query(sql, (err, result) => {
            result = JSON.parse(JSON.stringify(result))
            const expenseIDs = []
            result.map((expense) => {
                expenseIDs.push(expense.id)
            })

            if (!expenseIDs.includes(id)) insertData()
            else
                return res.status(400).json({
                    msg: `Expense with id: ${id} already exists. Please Enter unique id.`,
                })
        })
    }

    const insertData = () => {
        sql = `INSERT INTO EXPENSES VALUES(${id}, '${name}', ${amount}, '${date}', ${createdBy})`

        mysqlConnection.query(sql, (err, result) => {
            if (!err) {
                res.status(201).json({ msg: "Insert Successful.", result })
            } else throw err
        })
    }

    checkUser()
}

const getTransaction = (req, res) => {
    const { id: expenseID } = req.params

    let sql = `SELECT * FROM EXPENSES WHERE id = ${expenseID}`

    mysqlConnection.query(sql, (err, result) => {
        if (!err) {
            result = JSON.parse(JSON.stringify(result))[0]

            if (!result)
                return res
                    .status(404)
                    .json({ msg: `Expense with id: ${expenseID} Not Found.` })

            res.status(200).json(result)
        } else throw err
    })
}

const updateTransaction = (req, res) => {
    const { id: expenseID } = req.params
    const { name, amount, date } = req.body

    if (!name || !amount || !date)
        return res.status(400).json({ msg: "Enter data properly." })

    let sql = `SELECT * FROM EXPENSES WHERE id = ${expenseID}`
    mysqlConnection.query(sql, (err, result) => {
        if (!err) {
            result = JSON.parse(JSON.stringify(result))[0]

            if (!result)
                return res
                    .status(404)
                    .json({ msg: `Expense with id: ${expenseID} Not Found.` })

            sql = `UPDATE EXPENSES SET name = '${name}', amount = ${amount}, date = '${date}' WHERE id = ${expenseID}`
            mysqlConnection.query(sql, (err, result) => {
                if (!err) {
                    res.status(200).json({ msg: "Update Successful.", result })
                } else throw err
            })
        } else throw err
    })
}

const deleteTransaction = (req, res) => {
    const { id: expenseID } = req.params

    let sql = `SELECT * FROM EXPENSES WHERE id = ${expenseID}`

    mysqlConnection.query(sql, (err, result) => {
        if (!err) {
            result = JSON.parse(JSON.stringify(result))[0]

            if (!result)
                return res
                    .status(404)
                    .json({ msg: `Expense with id: ${expenseID} Not Found.` })

            sql = `DELETE FROM EXPENSES WHERE id = ${expenseID}`
            mysqlConnection.query(sql, (err, result) => {
                if (!err) {
                    res.status(200).json({ msg: "Delete Successful.", result })
                } else throw err
            })
        } else throw err
    })
}

module.exports = {
    getAllTransactions,
    createTransaction,
    getTransaction,
    updateTransaction,
    deleteTransaction,
}
