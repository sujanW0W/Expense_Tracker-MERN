const express = require("express")
const router = express.Router()

const {
    getAllTransactions,
    createTransaction,
    getTransaction,
    updateTransaction,
    deleteTransaction,
} = require("../controllers/transactions")

router.get("/", getAllTransactions)

router.post("/", createTransaction)

router.get("/:id", getTransaction)

router.patch("/:id", updateTransaction)

router.delete("/:id", deleteTransaction)

module.exports = router
