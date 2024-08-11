const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const UserModel = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    pic: {
        type: String, default: 'https://www.elevenforum.com/attachments/images-jpeg-2-jpg.45643/'
    }
}, {
    timestamps: true,
})

UserModel.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

UserModel.pre('save', async function (next) {
    if (!this.isModified('password')) { // Check if only the password field is modified
        return next(); // Exit middleware
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword; // Assign the hashed password back to this.password
        next(); // Proceed to save the document
    } catch (error) {
        next(error); // Pass any errors to the next middleware or error handler
    }
});


const User = mongoose.model('User', UserModel);
module.exports = User;
