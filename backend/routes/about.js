const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const aboutController = require('../controllers/aboutController');

const uploadDir = path.join(__dirname, '..', 'Uploads', 'about-image');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'), false);
    }
    cb(null, true);
  },
});

router.get('/', aboutController.getAbout);
router.get('/all', aboutController.getAllAbouts);
router.get('/:id', aboutController.getAboutById);
router.post('/', upload.single('image'), aboutController.createAbout);
router.put('/:id', upload.single('image'), aboutController.updateAbout);
router.delete('/:id', aboutController.deleteAbout);

module.exports = router;