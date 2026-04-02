import 'dotenv/config';
import { handlePlayerLogin, handlePlayerLogout, handlePlayerMove } from './PlayerHandlers.js';

export const socketEvents = (io, socket) => {
    socket.on('disconnect', () => handlePlayerLogout(socket, io));

    // EVENTOS DE PLAYER
    socket.on('player:login', (data) => handlePlayerLogin(socket, io, data));
    socket.on('player:logout', () => handlePlayerLogout(socket, io));
    socket.on('player:move', (data) => handlePlayerMove(socket, io, data));

    // EVENTOS DE CONSOLA
    //socket.on('console:general', () => handleConsoleGeneral(socket, io));
};