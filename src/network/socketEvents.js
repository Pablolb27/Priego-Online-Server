module.exports = (io, socket) => {
    socket.on('player:join', (userData) => {
        console.log(`${socket.id} se ha unido al mundo.`);
    });
    socket.on('disconnect', () => {
        console.log(`${socket.id} ha salido.`);
    });
};