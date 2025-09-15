const express = require('express');
const router = express.Router();
const appointmentFormsController = require('../controllers/appointmentForms');

router.post('/', appointmentFormsController.createAppointment);
router.get('/', appointmentFormsController.getAllAppointments);
router.delete('/:id', appointmentFormsController.deleteAppointment);

module.exports = router;