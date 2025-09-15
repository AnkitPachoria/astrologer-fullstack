const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const testimonialController = require('../controllers/testimonialController');

const uploadDir = path.join(__dirname, '..', 'Uploads', 'testimonial-image');
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage, limits: { fileSize: 5*1024*1024 }, fileFilter: (req,file,cb) => {
    if (!file.mimetype.startsWith('image/')) return cb(new Error('Only image files are allowed'), false);
    cb(null, true);
}});

router.get('/', testimonialController.getAll);
router.get('/:id', testimonialController.getById);
router.post('/', upload.single('image'), testimonialController.create);
router.put('/:id', upload.single('image'), testimonialController.update);
router.delete('/:id', testimonialController.delete);

module.exports = router;
 