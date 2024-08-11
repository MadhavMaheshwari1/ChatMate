const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./Config/db.js');
const userRoutes = require('./Routes/userRoutes.js');
const chatRoutes = require('./Routes/chatRoutes.js');
const messageRoutes = require('./Routes/messageRoutes.js');
const { notFoundHandler, errorHandler } = require('./Middlwares/errorMiddleWare.js');
const path = require('path');

dotenv.config();
const app = express();
connectDB();

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/message', messageRoutes);

// +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+ Deployment + +-+-+-+-+-+-+-+-+-+-+-+-+


if (process.env.NODE_ENV === "production") {
    console.log("Serving static files from: ", path.join(__dirname, "frontend", "build"));
    app.use(express.static(path.join(__dirname, "frontend", "build")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
    });
}
// +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+ Deployment + +-+-+-+-+-+-+-+-+-+-+-+-+
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("API is running...");
});

app.use(notFoundHandler);
app.use(errorHandler);

const server = app.listen(
    PORT,
    console.log(`Server running on PORT ${PORT}...`)
);

const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: `http://localhost:3000`,
        // credentials: true,
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

    socket.on("new message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;

        if (!chat.users) return console.log("chat.users not defined");

        chat.users.forEach((user) => {
            if (user._id == newMessageRecieved.sender._id) return;

            socket.in(user._id).emit("message recieved", newMessageRecieved);
        });
    });

    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    });
});
