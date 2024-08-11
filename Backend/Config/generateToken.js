import jwt from 'jsonwebtoken';

const generateToken = (user) => {
    const payload = {
        id: user._id,
        email: user.email,
        name: user.name, // Add more user data as needed
    };

    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }); // Token expires in 1 hour
};

export default generateToken;
