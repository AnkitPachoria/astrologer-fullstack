const express = require('express');
const router = express.Router();
const seoController = require('../controllers/seoController');

router.get('/', seoController.getSeo);
router.post('/', seoController.upsertSeo);
router.put('/:id', seoController.upsertSeo);

module.exports = router;