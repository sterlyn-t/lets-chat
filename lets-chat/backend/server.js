const express = require('express');
const { chats } = require('./data/data');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { notFound, errorHandler} = require('./middleware/errorMiddleware')

dotenv.config();
connectDB();
const app = express();
// To accept json data
app.use(express.json());

// API end points
 app.get('/', (req, res) => {
    res.send("API is running");
 });

app.get('/api/chat', (req, res) => {
    res.send(chats)
});

app.get('/api/chat/:id', (req, res) => {
    console.log(req.params.id);
    const chat = chats.find(chat => chat._id === req.params.id);
    res.send(chat);
});

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, console.log(`Server started on PORT ${PORT}`.yellow.bold));

const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000",
    }
});

// Creating connection
io.on("connection", (socket) => {
    console.log("Connected to socket.io");
    // Creating a new room
    socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    });

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User joined room: " + room);
    });

    socket.on("new message", (newMessageReceived) => {
        var chat = newMessageReceived.chat;

        if (!chat.users || chat.users === null || chat.users === undefined) return console.log("chat.users not defined");

        chat.users.forEach(user => {
            if (user._id === newMessageReceived.sender._id){
                return;
            }
            socket.in(user._id).emit("message received", newMessageReceived);
        })
    });

    socket.on('typing', (room) => socket.in(room).emit("typing"));
    socket.on('stop typing', (room) => socket.in(room).emit("stop typing"));

    socket.off("setup", () => {
        console.log("User Disconnected");
        socket.leave(userData._id);
    })

});