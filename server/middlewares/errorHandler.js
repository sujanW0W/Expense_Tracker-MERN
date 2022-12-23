const { CustomError } = require("../errors")

const errorHandler = (err, req, res, next) => {
    if (err instanceof CustomError) {
        return res.status(err.statusCode).json({ msg: err.message })
    }

    res.status(500).json({ msg: "Something went Wrong.", err })
}

module.exports = errorHandler
