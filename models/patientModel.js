const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')
const crypto = require('crypto');

const patientsSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true, validate: [validator.isEmail, 'Please Provide a valid email'] },
    name: { type: String, required: [true, 'Please write your name'] },
    age: { type: Number, required: [true, 'Age is required'], min: 16, max: 120 }, // Assuming reasonable age range
    medicalHistory: { type: String, required: [true, "It's important to provide your medical history for a more accurate assessment."] },
    lifeStyle: { type: String, default: 'Unknown' }, // Default value for lifestyle
    gender: { type: String,enum: ['male', 'female','Male','Female'],  default: 'Unknown' }, // Using enum for gender
    photo: String,
    password: { type: String, required: [true, 'Password is required'], minlength: 8 },
    passwordConfirmation: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            validator: function(value) {
                return this.password === value;
            },
            message: 'Passwords do not match'
        }
    },
    passwordResetToken: String,
    passwordResetExpires: Date 
});

patientsSchema.pre('save', async function(next) {
    // Hash the password only if it's modified or new
    if (!this.isModified('password')) return next();

    try {
        // Generate a salt
        const salt = await bcrypt.genSalt(10);
        // Hash the password along with the new salt
        this.password = await bcrypt.hash(this.password, salt);
        // Do not save the passwordConfirmation field
        this.passwordConfirmation = undefined;
        next();
    } catch (error) {
        next(error);
    }
});



patientsSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

      console.log({resetToken}, this.passwordResetToken)
  
    // Use the built-in Date object
    this.passwordResetExpires = Date.now() + 5 * 60 * 1000;
    return resetToken;
  };
  


const Patient = mongoose.model('Patient', patientsSchema);
module.exports = Patient;
