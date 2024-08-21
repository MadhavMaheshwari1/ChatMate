import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Importing the modules using ES6 import syntax
import connectDB from './Config/db.js';
import userRoutes from './Routes/userRoutes.js';
import chatRoutes from './Routes/chatRoutes.js';
import messageRoutes from './Routes/messageRoutes.js';
import { notFoundHandler, errorHandler } from './Middlewares/errorMiddleWare.js';

// Initialize dotenv
dotenv.config();

// Create an instance of Express
const app = express();

// Connect to the database
connectDB();

// Middleware to parse JSON
app.use(express.json());

// Define API routes
app.use('/api/users', userRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/message', messageRoutes);

// Deployment configuration
if (process.env.NODE_ENV === "production") {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    console.log("Serving static files from: ", path.join(__dirname, "frontend", "build"));
    app.use(express.static(path.join(__dirname, "frontend", "build")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
    });
}

// Root route
app.get("/", (req, res) => {
    res.send("API is running...");
});

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Server running on PORT ${PORT}...`));

// Socket.io setup
import { Server as SocketIOServer } from 'socket.io';
const io = new SocketIOServer(server, {
    pingTimeout: 60000,
    cors: {
        origin: `https://chatmate-b4t0.onrender.com`,
    },
});

io.on("connection", (socket) => {
    console.log("Connected to socket.io");

    socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    });

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User Joined Room: " + room);
    });

    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on("new message", (newMessageReceived) => {
        const { chat } = newMessageReceived;

        if (!chat.users) return console.log("chat.users not defined");

        chat.users.forEach((user) => {
            if (user._id === newMessageReceived.sender._id) return;
            socket.in(user._id).emit("message received", newMessageReceived);
        });
    });

    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    });
});
