const  express = require('express')

// Router 
const router = express.Router()

// import validators
const { userRegisterValidator, userLoginValidator } = require('../validators/auth');
const { runValidation } = require('../validators');

// importing Controller
const { registerController, registerActivate, login }  = require('../controllers/auth')

// Routing
// router.get('/register', registerController)
router.post('/register', userRegisterValidator, runValidation, registerController) // before controller must have validators
router.post('/register/activate', registerActivate);
router.post('/login', userLoginValidator, runValidation,login);



module.exports = router