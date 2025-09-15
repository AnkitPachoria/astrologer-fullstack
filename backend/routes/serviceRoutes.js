const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const serviceController = require('../controllers/serviceController');

const uploadDir = path.join(__dirname, '..', 'Uploads', 'service-image');

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

router.get('/', serviceController.getServices);
router.get('/:id', serviceController.getServiceById);
router.get('/:citySlug/:categorySlug/:serviceSlug', serviceController.getServiceBySlug);
router.post('/', upload.single('image'), serviceController.createService);
router.put('/:id', upload.single('image'), serviceController.updateService);
router.delete('/:id', serviceController.deleteService);

module.exports = router;