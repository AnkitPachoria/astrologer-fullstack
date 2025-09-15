const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menu-controller');

router.get('/', menuController.getAllMenus);
router.post('/', menuController.addMenu);
router.get('/:id', menuController.getMenuById);
router.put('/:id', menuController.updateMenu);
router.delete('/:id', menuController.deleteMenu);

module.exports = router; 