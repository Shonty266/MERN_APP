const router = require('express').Router()
const { signupValidation, loginValidation } = require('../Middlewares/AuthValidation')
const { signup, login } = require('../Controllers/AuthController')



router.post('/admin/login', loginValidation, login);

router.post('/admin/signup', signupValidation, signup);


module.exports = router;