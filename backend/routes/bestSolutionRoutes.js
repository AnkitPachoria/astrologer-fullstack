const express = require('express');
const router = express.Router();
const bestSolutionController = require('../controllers/bestSolutionController');
const multer = require('multer');
const path = require('path');

// 🟨 Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../Uploads/best-solution-image'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// 🛠 Routes 
router.get('/', bestSolutionController.getAll);
router.get('/:id', bestSolutionController.getById);
router.post('/', upload.single('image'), bestSolutionController.create);
router.put('/:id', upload.single('image'), bestSolutionController.update);
router.delete('/:id', bestSolutionController.delete);

module.exports = router;
  