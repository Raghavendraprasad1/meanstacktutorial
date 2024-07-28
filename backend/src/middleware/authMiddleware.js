const handleException = require('../utils/errorHandler')
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    if(req.header('Authorization') == null)
    {
      return res.status(400).json({ error: "Enter a valid token"})
    }
    const token = req.header('Authorization').replace("Bearer ", "");
    if(!token)
    {
      return res.status(400).json({ error: "Enter a valid token"})
    }
   // verify the token

   const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

   req.user = decodedToken;

   console.log("details: ", req.user);

  



    next();
  } catch (error) {

    if(error instanceof jwt.TokenExpiredError)
    {
      return res.status(401).json({ error: "Token Expired"})
    }

    handleException(error, res)
  }
}

module.exports = authMiddleware;
