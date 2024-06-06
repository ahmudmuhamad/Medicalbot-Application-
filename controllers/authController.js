const Patient = require('./../models/patientModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); 
const sendEmail = require('./../Utilites/email');

exports.signup = async (req, res, next) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const newPatient = await Patient.create({
            email: req.body.email,
            name: req.body.name,
            password: hashedPassword,
            passwordConfirmation: req.body.passwordConfirmation 
        });

        const token = jwt.sign(
            { id: newPatient._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN }
        );
        
        res.status(201).json({
            status: 'Success',
            token,
            data: {
                patient: newPatient
            }
        });
    } catch (err) {
        next(err); // Pass the error to the next middleware function
    }
};


exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Check if the user exists
        const patient = await Patient.findOne({ email });
        if (!patient) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check if the password is correct
        const passwordMatch = await bcrypt.compare(password, patient.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign({ patientId: patient._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

        // Send the token in the response
        res.status(200).json({
            status: 'success',
            token: token, // Send the generated token
            data: {
                patient: patient
            }
        });
    } catch (err) {
        next(err);
    }
};


/*
exports.protect = catchAsync(async(req,res,next) => {
    //Get The token and checking it's existence 


    //Verficiation token


    //Checking if the user exists 
    //Check if user changes his password after token was issued


    next();
})*/



exports.forgotPassword = async (req, res, next) => {
    // Get the email from the request body
    const { email } = req.body;
  
    try {
      // Find the user by email (assuming your model is named 'Patient')
      const patient = await Patient.findOne({ email });
  
      // Check if user exists
      if (!patient) {
        return res.status(404).json({ message: 'Email not found' });
      }
  
      // Generate a password reset token (assuming the function exists)
      const resetToken = patient.createPasswordResetToken();
  
      // Save the patient with the generated reset token
      await patient.save({ validateBeforeSave: false });
  
      // Create a reset password link (without exposing the token)
      const resetURL = `${req.protocol}://${req.get('host')}/api/v1/patients/resetPassword/${resetToken}`;

      const message = `Forgot your password? Click Here to reset your password ${resetURL} 
      \n If you didn't forget your password, Please ignore this email`;
  
      try {
        await sendEmail({
          email: patient.email,
          subject: 'Your password reset request',
          message,
        });
        res.status(200).json({
          status: 'Success',
          message: 'Token sent!',
        });
      } catch (error) {
        console.error('Error sending email:', error);
        // Consider sending a generic error message to the user here
        res.status(500).json({ message: 'Server error' });
      }
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  


  exports.resetPassword = async (req, res, next) => {
    // Get the reset token and new password from the request body
    const { token, newPassword, passwordConfirmation } = req.body;
  
    try {
      // Find the patient by the reset token (no need to hash the token)
      const patient = await Patient.findOne({
        passwordResetToken: token,
        passwordResetExpires: { $gt: Date.now() }, // Ensure token hasn't expired
      });
  
      /* Check if patient and token are valid
      if (!patient) {
        return res.status(400).json({ message: 'Invalid token' });
      }*/
  
      // Validate password confirmation (assuming it's a separate field)
      if (newPassword !== passwordConfirmation) {
        return res.status(400).json({ message: 'Passwords do not match' });
      }
  
      // Hash the new password before saving
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      patient.password = hashedPassword;
  
      // Remove reset token data
      patient.passwordResetToken = undefined;
      patient.passwordResetExpires = undefined;
      await patient.save();
  
      // Consider if a new token needs to be issued here (optional)
      // const token = signToken(patient._id)  // ...
  
      res.status(200).json({ 
        status: 'success',
        // Include the new token if needed: token,
        message: 'Password reset successful' });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  

  
  