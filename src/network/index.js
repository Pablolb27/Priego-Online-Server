require('dotenv').config();
const { handleLogin, handleLogout } = require('./PlayerHandlers');

module.exports = (io, socket) => {
    socket.on('disconnect', () => handleLogout(socket, io));

    socket.on('player:login', (data) => handleLogin(socket, io, data));
    socket.on('player:logout', () => handleLogout(socket, io));
};