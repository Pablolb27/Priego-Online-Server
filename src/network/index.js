import 'dotenv/config';
import { handleLogin, handleLogout } from './PlayerHandlers.js';

export const socketEvents = (io, socket) => {
    socket.on('disconnect', () => handleLogout(socket, io));

    // EVENTOS DE PLAYER
    socket.on('player:login', (data) => handleLogin(socket, io, data));
    socket.on('player:logout', () => handleLogout(socket, io));

    // EVENTOS DE CONSOLA
    socket.on('console:general', () => {
        if (typeof handleConsoleGeneral === 'function') {
            handleConsoleGeneral(socket, io);
        }
    });
};