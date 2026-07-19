import state from '../entities/GameStage.js';
import Player from '../models/Player.js';
import { calcRandomPosition, getBody } from '../utils.js';
import crypto from 'crypto';

export const handleBotAdd = async (socket) => {
    const key = crypto.randomUUID();
    const name = 'MAGO BOT';
    const templateBot = await Player.findOne({ name: 'Priego BoT' }).lean();
    const position = calcRandomPosition(templateBot.map);

    state.bots[key] = {
        ...templateBot,
        id: key,
        name,
        position
    };

    // ACTUALIZAMOS EL MAPA EN EL STATE
    state.maps[templateBot.map][position.x][position.y].isBloqued = key;

    // ENVIA A LOS USUARIOS
    socket.emit('bot:add', state.bots[key]);
    socket.broadcast.emit('bot:add', state.bots[key]);

    // LOG DEL SV
    console.log(`[BOT] Se añadió un bot.`);
};
