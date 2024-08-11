import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    pic: {
        type: String, 
        default: 'https://www.elevenforum.com/attachments/images-jpeg-2-jpg.45643/'
    }
}, {
    timestamps: true,
});

// Method to match password
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Pre-save hook to hash password
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next(); // Exit middleware if password is not modified
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

const User = mongoose.model('User', UserSchema);

export default User;
