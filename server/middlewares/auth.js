const jwt = require("jsonwebtoken")
const { BadRequest, UnAuthorized } = require("../errors")

const auth = (req, res, next) => {
    const authString = req.headers.authorization
    if (!authString || !authString.startsWith("Bearer "))
        throw new UnAuthorized("Authentication Header Error.")

    const token = authString.split(" ")[1]

    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.users = payload
    next()
}

module.exports = auth
