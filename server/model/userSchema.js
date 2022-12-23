const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const userSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: [true, "Please Provide Full Name."],
        trim: true,
        maxLength: [30, "Name can not exceed more than 30 characters."],
    },
    userName: {
        type: String,
        required: [true, "Please Provide Unique userName."],
        trim: true,
        minLength: [5, "Username must be at least 5 characters long."],
        maxLength: [15, "Username must not exceed more than 15 characters."],
        unique: true,
    },
    email: {
        type: String,
        required: [true, "Please provide Valid Email address."],
        unique: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please Provide Valid Email Address.",
        ],
    },
    password: {
        type: String,
        required: [true, "Please provide strong Password."],
        minLength: [6, "Password must be at least 6 characters long."],
    },
})

userSchema.pre("save", async function () {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.verifyPassword = async function (password) {
    const isMatch = await bcrypt.compare(password, this.password)
    return isMatch
}

userSchema.methods.generateToken = function () {
    const userDetails = {
        userID: this._id,
        fullName: this.fullName,
        userName: this.userName,
    }
    const token = jwt.sign(userDetails, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFETIME,
    })
    return token
}

module.exports = mongoose.model("Users", userSchema)
