
const multer = require('multer');
const express = require('express');
const router = express.Router();
const path = require('path');


const {ocrController}  = require("../controllers");

// Set storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads');
    console.log("uploadPath: ", uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 } // 10MB limit
});

  // Upload endpoint
router.post('/extract-text', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const filename = req.file.filename;
  console.log('Uploaded file:', filename);
  ocrController.extractTextFromFile(req, res, filename);
});

module.exports = router



