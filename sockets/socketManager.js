const socketIo = require('socket.io');

let io;

function initSocket(server) {
    io = socketIo(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            credentials: true
        }
    });
    io.on('connection', socket => {
        console.log('Cliente conectado');

        socket.on('disconnect', () => {
            console.log('Cliente desconectado');
        });
    });
}

function emitEvent(eventName, data) {
    if (io) {
        console.log(`Se emite evento '${eventName}' con data: ${data}`);
        io.emit(eventName, data);
    }
}

module.exports = {
    initSocket,
    emitEvent,
};