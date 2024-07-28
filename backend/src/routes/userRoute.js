const express = require('express');

const {userController}  = require("../controllers");
const ageMiddleware = require('../middleware/ageMiddleware');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();


// public routes
router.post('/signup', userController.signUp);
router.post('/login', userController.login);

router.use(authMiddleware);

// private routes
router.get('/', authMiddleware, userController.getUser);
router.post('/create', userController.createUser);
router.patch('/update/:userId', userController.updateUser);
router.delete('/delete/:userId', userController.deleteUser);


module.exports = router