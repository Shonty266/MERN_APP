const router = require('express').Router();
const { 
  addemployee,
  getallemployees,
  deleteemployee,
  editemployee,
  adddocument,
  showalldocuments,
  getdocument
} = require('../Controllers/AdminController');
const upload = require('../Middlewares/Multer');

router.post('/addemployee', addemployee);
router.get('/getallemployees', getallemployees);
router.delete('/deleteemployee/:id', deleteemployee);
router.put('/editemployee/:id', editemployee);
router.post('/adddocument/:id', upload.single('file'), adddocument);
router.get('/showalldocuments/:id', showalldocuments);
router.get('/document/:employeeId/:documentId', getdocument);

module.exports = router;