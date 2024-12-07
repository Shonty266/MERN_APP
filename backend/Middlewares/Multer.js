const multer = require("multer");
const path = require("path");

// Configure how the files are stored
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Where to store the file
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // Generate unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  // Accept only specific file types
  const allowedMimes = [
    "image/jpeg",
    "image/jpg", 
    "image/png",
    "application/pdf",
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, PDF and DOC files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10, // Increased to 10MB
  },
  fileFilter: fileFilter,
});

module.exports = upload;