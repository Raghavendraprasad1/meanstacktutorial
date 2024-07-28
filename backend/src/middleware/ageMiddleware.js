const handleException = require('../utils/errorHandler')

const ageMiddleware = (req, res, next) => {
  try {
    const age = req.query.age

    if (!age || isNaN(age)) {
      return res.status(400).json({ error: "Invalid age provided" })
    }

    if(parseInt(age) < 18)
    {
      return res.status(403).json({ error: "User must be 18 years or older"})
    }

    next();

    console.log("middleware called !");

  } catch (error) {
    handleException(error, res)
  }
}

module.exports = ageMiddleware;
