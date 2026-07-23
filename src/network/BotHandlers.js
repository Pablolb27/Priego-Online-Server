import { botAdd, botRemove, botToggleMovement } from '../sistems/Bot.js';

export const handleBotAdd = (socket) => {
    botAdd(socket);
};

export const handleBotRemove = (socket) => {
    botRemove(socket);
};

export const handleBotToggleMovement = (socket) => {
    botToggleMovement(socket);
};