const express = require('express');
//const { router } = require('../app');
const app = express();
const fs = require('fs');
const Patient = require('../models/patientModel');




exports.getPatient =async (req, res) => {
     try{
    const patient = await Patient.findById(req.params.id);
    res.status(200).json({
        status: 'success',
        data: {
            patient
        }
    });
}catch(err){
    res.status(404).json({
        status: 'fail',
        message: err.message
    })

}
};
//////////////////////////////////////////////////
/*exports.checkId = (req, res, next, val ) =>{
    if (index === -1) { // Check if patient exists
        return res.status(404).json({
            status: 'fail',
            message: 'Patient not found'
        });
    }
    next();
}*/


exports.getAllPatients = async (req, res) => {
    try {
        const patients = await Patient.find();
        res.status(200).json({
            status: 'success',
            results: patients.length,
            data: {
                patients
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'failed',
            message: err.message
        });
    }
};

app.use(express.json());

exports.createPatient = async (req, res) => {
    try{
        const newPatient = await Patient.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                    patient: newPatient
                }
                    });
    }catch (err) {
        res.status(400).json({
            status: "failed",
            message: err.message
        }) 
    }
    
    
}
///////////////////////////////////////////////////

exports.updatePatient = async (req, res) => {
    try {
        const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!patient) {
            return res.status(404).json({
                status: 'fail',
                message: 'Patient not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                patient
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

    




//////////////////////////////////////////////////

exports.deletePatient = async (req, res) => {
    try {
        const patient = await Patient.findByIdAndDelete(req.params.id);

        if (!patient) {
            return res.status(404).json({
                status: 'fail',
                message: 'Patient not found'
            });
        }

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};
