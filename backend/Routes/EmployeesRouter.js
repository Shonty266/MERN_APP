const router = require('express').Router()
const { addemployee , getallemployees , deleteemployee , editemployee } = require('../Controllers/EmployeeController')
const ensureAuthenticated = require('../Middlewares/Auth')



router.post('/addemployee' , addemployee)

router.get('/getallemployees' , getallemployees)

router.delete('/deleteemployee/:id' , deleteemployee)

router.put('/editemployee/:id' , editemployee)



module.exports = router;