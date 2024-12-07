const router = require('express').Router();
const { 
  addemployee,
  getallemployees,
  deleteemployee,
  editemployee,
  adddocument,
  showalldocuments 
} = require('../Controllers/AdminController');
const upload = require('../Middlewares/Multer');

router.post('/addemployee', addemployee);
router.get('/getallemployees', getallemployees);
router.delete('/deleteemployee/:id', deleteemployee);
router.put('/editemployee/:id', editemployee);
router.post('/adddocument/:id', upload.single('file'), adddocument);
router.get('/showalldocuments/:id', showalldocuments);

module.exports = router;