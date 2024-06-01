const express = require('express');
//const { router } = require('../app');
const app = express();
const fs = require('fs');
const router = express.Router() 
const patientController = require('./../controllers/patientController');
const authController = require('./../controllers/authController');
const chatgpt = require('./../controllers/chatgpt');




//Routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotpassword', authController.forgotPassword);
//router.post('/chat', chatgpt.chat);
router.patch('/resetpassword/:token', authController.resetPassword);

router.
    route('/')
    .get(patientController.getAllPatients)
    .post(patientController.createPatient)


router
.route('/:id')
.get(patientController.getPatient)
.patch(patientController.updatePatient)
.delete(patientController.deletePatient); 

module.exports = router;