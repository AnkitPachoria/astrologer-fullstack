const express = require('express');
const router = express.Router();
const homeSettingController = require('../controllers/homeSettingController');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// Upload directory for home images
const uploadDir = path.join(__dirname, '..', 'Uploads', 'home-image');
fs.mkdir(uploadDir, { recursive: true }).catch(err => console.error('Error creating upload directory:', err));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'));
    }
    cb(null, true);
  }, 
});

router.get('/', homeSettingController.getHomeSetting);
router.post(
  '/',
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'image', maxCount: 1 },
    { name: 'icon_image', maxCount: 1 },
  ]),
  homeSettingController.saveHomeSetting
);
router.delete('/:id', homeSettingController.deleteHomeSetting);

module.exports = router;