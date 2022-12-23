const mongoose = require("mongoose")

const transactionSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Where did you spent the money?"],
            trim: true,
            maxLength: [30, "Can not exceed more than 30 characters."],
        },
        amount: {
            type: Number,
            required: [true, "How much did you spent?"],
        },
        date: {
            type: String,
            required: [true, "When was this transaction performed?"],
        },
        createdBy: {
            type: mongoose.Types.ObjectId,
            ref: "Users",
            required: [true, "Who created the transaction?"],
        },
    },
    { timeStamps: true }
)

module.exports = mongoose.model("Transactions", transactionSchema)
