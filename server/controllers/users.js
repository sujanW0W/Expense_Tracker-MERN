/*

const Users = require("../model/userSchema")
const { StatusCodes } = require("http-status-codes")
const { NotFound, BadRequest, UnAuthorized } = require("../errors")

const register = async (req, res) => {
    //full name, userName, email, password
    const user = await Users.create(req.body)

    const token = user.generateToken()
    res.status(StatusCodes.OK).json({
        msg: `User, '${user.userName}' is created successfully.`,
        token,
    })
}

const login = async (req, res) => {
    const { userName, password } = req.body
    if (!userName || !password)
        throw new BadRequest("Please Provide Valid Credentials.")

    const user = await Users.findOne({ userName })
    if (!user) throw new NotFound(`User, '${userName}' not Found.`)

    const isMatch = await user.verifyPassword(password)
    if (!isMatch)
        throw new UnAuthorized("Password incorrect. Please Try Again.")

    const token = user.generateToken()
    res.status(StatusCodes.OK).json({ msg: "Login Successful.", token })
}

module.exports = { register, login }

*/

//MySQL

const { mysqlConnection } = require("../DB/connectDB")
const { BadRequest, NotFound } = require("../errors/")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const register = async (req, res) => {
    const { fullName, age, userName, email, password } = req.body

    //Validation
    if (!fullName || !age || !userName || !email || !password)
        throw new BadRequest("Invalid Credentials.")

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    let sql = `INSERT INTO USER(fullName, age, userName, email, password) VALUES('${fullName}', ${age}, '${userName}', '${email}', '${hashedPassword}')`

    await mysqlConnection.query(sql, (err) => {
        if (err) throw err
        console.log("Inserted Successfully.")
    })

    sql = `SELECT id from USER where userName = '${userName}'`

    await mysqlConnection.query(sql, (err, result) => {
        result = JSON.parse(JSON.stringify(result[0]))

        const token = jwt.sign(
            { id: result.id, fullName, userName, email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_LIFETIME }
        )

        res.status(201).json({ msg: "Inserted Successfully", token })
    })
}

const login = async (req, res) => {
    const { userName, password } = req.body

    if (!userName || !password) throw new BadRequest("Invalid Credentials.")

    let sql = `SELECT * from USER where userName = '${userName}'`

    await mysqlConnection.query(sql, (err, result) => {
        if (!err) {
            if (result.length === 0)
                return res.status(404).json({ msg: `${userName} Not Found.` })

            result = JSON.parse(JSON.stringify(result[0]))

            const isMatchFunction = async () => {
                isMatch = await bcrypt.compare(password, result.password)

                if (!isMatch)
                    return res.status(401).json({ msg: "Password Incorrect." })

                const token = jwt.sign(
                    {
                        id: result.id,
                        fullName: result.fullName,
                        userName,
                        email: result.email,
                    },
                    process.env.JWT_SECRET,
                    { expiresIn: process.env.JWT_LIFETIME }
                )
                res.status(200).json({ msg: "Login Successful.", token })
            }

            isMatchFunction()
        } else throw err
    })
}

module.exports = { register, login }
