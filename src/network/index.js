import 'dotenv/config';
import { handlePlayerChat, handlePlayerLogin, handlePlayerLogout, handlePlayerMove } from './PlayerHandlers.js';

export const socketEvents = (io, socket) => {
    socket.on('disconnect', () => handlePlayerLogout(socket, io));

    // EVENTOS DE PLAYER
    socket.on('player:login', (data) => handlePlayerLogin(socket, data));
    socket.on('player:logout', () => handlePlayerLogout(socket, io));
    socket.on('player:move', (data) => handlePlayerMove(socket, data));
    socket.on('player:chat', (data) => handlePlayerChat(socket, data));
};