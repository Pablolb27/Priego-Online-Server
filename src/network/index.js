import 'dotenv/config';
import { handleBotAdd, handleBotRemove, handleBotToggleMovement } from './BotHandlers.js';
import { handlePlayerChat, handlePlayerLogin, handlePlayerLogout, handlePlayerMove } from './PlayerHandlers.js';

export const socketEvents = (io, socket) => {
    socket.on('disconnect', () => handlePlayerLogout(socket));

    // EVENTOS DE PLAYER
    socket.on('player:login', (data) => handlePlayerLogin(socket, data));
    socket.on('player:logout', () => handlePlayerLogout(socket));
    socket.on('player:move', (data) => handlePlayerMove(socket, data));
    socket.on('player:chat', (data) => handlePlayerChat(socket, data));

    //EVENTOS DE BOT
    socket.on('bot:toggleMovement', () => handleBotToggleMovement(socket));
    socket.on('bot:add', () => handleBotAdd(socket));
    socket.on('bot:remove', () => handleBotRemove(socket));

};