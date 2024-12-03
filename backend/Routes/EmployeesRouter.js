const router = require('express').Router()
const ViewEmployees = require('../Controllers/EmployeeController')
const ensureAuthenticated = require('../Middlewares/Auth')



router.get('/viewemployees' , ensureAuthenticated, ViewEmployees)


module.exports = router;