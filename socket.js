let users = {}; // { socketId : username }

module.exports = (server) => {
    const io = require("socket.io")(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });
    console.log("inside socket.js");
    io.on('connection', (socket) => {
        // io.emit('send-message').to()
        console.log("a socket client is connected");
        socket.on("joinChat", (data) => {
            const socketId = socket.id;
            console.log("socket id ==> ", socket.id);
            users[socketId] = data.userName;

            // broadcasting to all client except the last joined that a new user is joined
            io.emit(
                'message',
                users
            );
        })

        socket.on("chatMessage", (data) => {
            const { otherUserSocketId, msg } = data;
            // io.emit('send-message').to()
            let message = {
                msg,
                fromUser: users[socket.id] // user who send this message
            }
            socket.broadcast.to(otherUserSocketId).emit('receiveMsg', message);
        })

        // Runs when client disconnects
        socket.on('disconnect', () => {
            delete users[socket.id];
            socket.broadcast.emit(
                'message',
                users
            )
            // if (user) {
            //     io.to(user.room).emit(
            //         'message',
            //         formatMessage(botName, `${user.username} has left the chat`)
            //     );

            //     // Send users and room info
            //     io.to(user.room).emit('roomUsers', {
            //         room: user.room,
            //         users: getRoomUsers(user.room)
            //     });
            // }
        });

    })

}

