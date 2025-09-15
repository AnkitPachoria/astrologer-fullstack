const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/bannerController');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'Uploads/bannerimage');
  },
  filename: (req, file, cb) => {
    const prefix = file.fieldname.startsWith('mob_') ? 'mobile-' : '';
    cb(null, `${prefix}${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.get('/', bannerController.getBanner);
router.post(
  '/',
  upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'mob_image1', maxCount: 1 },
    { name: 'mob_image2', maxCount: 1 },
    { name: 'mob_image3', maxCount: 1 },
  ]),
  bannerController.createBanner
);
router.put(
  '/:id',
  upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'mob_image1', maxCount: 1 },
    { name: 'mob_image2', maxCount: 1 },
    { name: 'mob_image3', maxCount: 1 },
  ]),
  bannerController.updateBanner
);
router.delete('/:id', bannerController.deleteBanner);

module.exports = router;