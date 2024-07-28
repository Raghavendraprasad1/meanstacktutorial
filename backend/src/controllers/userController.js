const User = require('../models/userModel');
const messages = require('../utils/language');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleException = require('../utils/errorHandler');

const getUser = async (req, res) => {
  try {

    console.log("user session details: ", req.user);

    const users = await User.find()

    if (users) {
      res.status(200).json({
        status: 'success',
        message: messages.USER_FETCH,
        data: users
      })
    } else {
      res.status(200).json({
        status: 'success',
        message: messages.DATA_NOT_FOUND,
        data: []
      })
    }
  } catch (error) {

    handleException(error, res);
    
  }
}

// post API

const createUser = async (req, res) => {
  try {

    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ error: messages.REQUIRED_FIELDS })
    }

    // check email for unique
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res
        .status(400)
        .json({ error: messages.UNIQUE_EMAIL})
    }

    const newUser = new User({ name, email, password })
    const saveResult = await newUser.save()

    if (saveResult) {
      return res
        .status(201)
        .json({ result: saveResult, message: messages.USER_CREATED })
    }
  } catch (error) {
    handleException(error, res);
  }
}

/**
 * PATCH API to update user details
 * @param {userId} req
 * @param {object} res
 *
 */

const updateUser = async (req, res) => {
  try {
    const { userId } = req.params

    // check email for unique
    const existingUser = await User.findById({userId})

    if (!existingUser) {
      return res.status(400).json({ error: messages.USER_NOT_EXIST })
    }

    if (req.body.name) {
      existingUser.name = req.body.name
    }

    if (req.body.email) {
      existingUser.email = req.body.email
    }
    if (req.body.password) {
      existingUser.password = req.body.password
    }

    const updateResult = await existingUser.save()

    if (updateResult) {
      return res
        .status(200)
        .json({ result: updateResult, message: messages.UPDATE_SUCCESS })
    }
  } catch (error) {
    handleException(error, res);
  }
}


const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params

    // check email for unique
    const existingUser = await User.findById(userId)

    if (!existingUser) {
      return res.status(400).json({ error: messages.USER_NOT_EXIST })
    }

    const deleteResult = await User.deleteOne({_id : userId});

    if (deleteResult) {
      return res
        .status(200)
        .json({ result: deleteResult, message: messages.DELETE_SUCCESS })
    }
  } catch (error) {
    handleException(error, res);
  }
}


/**
 * SignUp API to register new users
 * @param {Object} req 
 * @param {Object} res 
 * 
 */
const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ error: messages.REQUIRED_FIELDS })
    }

    // check email for unique
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res
        .status(400)
        .json({ error: messages.UNIQUE_EMAIL})
    }

     const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password:hashedPassword })
    const saveResult = await newUser.save();

    if (saveResult) {
      return res
        .status(201)
        .json({ result: saveResult, message: messages.SIGNUP_SUCCESS })
    }
  } catch (error) {
    handleException(error, res);
  }
}


/**
 * Login API to login users
 * @param {Object} req 
 * @param {Object} res 
 * 
 */
const login = async (req, res) => {
  try {
    console.log("body data: ",req.body);
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: messages.REQUIRED_FIELDS })
    }

    // check email for unique
    const existingUser = await User.findOne({ email })

    if (!existingUser) {
      return res
        .status(400)
        .json({ error: messages.INVALID_EMAIL})
    }

    const matchPassword = await bcrypt.compare(password, existingUser.password); 

    if (!matchPassword) {
      return res
        .status(400)
        .json({ error: messages.INVALID_PASSWORD})
    }

    const {password: excludePassword, ...newUser} = existingUser.toObject(); 

    const acessToken = generateToken(existingUser._id);
    const refreshToken = generaterRefreshToken(existingUser._id);

    if (acessToken && refreshToken) {
      return res
        .status(201)
        .json({ data: {newUser, acessToken, refreshToken}, message: messages.LOGIN_SUCCESS })
    }
  } catch (error) {
    handleException(error, res);
  }
}

const generateToken = (userId)=>{
  // jwt secret
  const secretKey = process.env.JWT_SECRET;
  const expiresIn = '15m';

  const token = jwt.sign({userId}, secretKey, {expiresIn});

  return token;
}

const generaterRefreshToken = (userId)=>{
  // jwt secret
  const secretKey = process.env.REFRESH_JWT_SECRET;
  const expiresIn = '7d';

  const token = jwt.sign({userId}, secretKey, {expiresIn});

  return token;
}


module.exports = {
  getUser,
  createUser,
  updateUser,
  deleteUser,
  signUp,
  login
}
