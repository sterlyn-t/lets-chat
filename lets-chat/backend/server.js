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
app.listen(PORT, console.log(`Server started on PORT ${PORT}`.yellow.bold));