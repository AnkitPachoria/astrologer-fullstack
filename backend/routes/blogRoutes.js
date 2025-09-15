const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const blogController = require('../controllers/blogController');

// ✅ Multer storage config for blogimage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '..', 'Uploads', 'blogimage'); // ✅ Corrected folder name
    cb(null, dir);
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
      return cb(new Error('Only image files are allowed'), false);
    }
    cb(null, true);
  },
});

// ✅ Blog Routes
router.get('/', blogController.getAll);
router.get('/:id', blogController.getById);
router.post('/', upload.single('image'), blogController.create);
router.put('/:id', upload.single('image'), blogController.update);
router.delete('/:id', blogController.delete);


module.exports = router;
