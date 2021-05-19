const express = require('express');
const app = express();
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
    cors: {origin: '*'}
});

io.on("connection", (socket) => {
    const { roomId } = socket.handshake.query
    socket.roomId = roomId
    socket.join(roomId)

    socket.on('connected', () => {
        console.log('user connected')
    })

    socket.on('disconnect', () => {
        console.log('user disconnected')
        socket.leave(roomId)
    })

    //sending messages
    socket.on('message', (message) => {
        io.emit('message', message)
    })
});

httpServer.listen(5000);


