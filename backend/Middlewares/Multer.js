const multer = require('multer');

// Use memory storage instead of disk storage for Vercel
const storage = multer.memoryStorage();

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 4 * 1024 * 1024 // 4MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.mimetype)) {
      cb(new Error('Invalid file type'), false);
    }
    cb(null, true);
  }
});

module.exports = upload;