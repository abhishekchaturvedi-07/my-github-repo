const  express = require('express')

// Router 
const router = express.Router()

// import validators
const { userRegisterValidator, userLoginValidator, forgotPasswordValidator, resetPasswordValidator } = require('../validators/auth');
const { runValidation } = require('../validators');

// importing Controller
const { registerController, registerActivate, login, requireSignin, forgotPassword, resetPassword }  = require('../controllers/auth')

// Routing
// router.get('/register', registerController)
router.post('/register', userRegisterValidator, runValidation, registerController) // before controller must have validators
router.post('/register/activate', registerActivate);
router.post('/login', userLoginValidator, runValidation,login);
router.put('/forgot-password', forgotPasswordValidator, runValidation, forgotPassword);
router.put('/reset-password', resetPasswordValidator, runValidation, resetPassword);

// router.get('/secret', requireSignin, (req, res) => {
//     res.json({
//         body: "This is a secret message for logged in user only"
//     })
// })



module.exports = router