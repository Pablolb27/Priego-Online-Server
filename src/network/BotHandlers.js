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
    socket.server.emit('bot:add', state.bots);

    // LOG DEL SV
    console.log(`[BOT] Se añadió un bot.`);
};

export const handleBotRemove = async (socket) => {
    const botIds = Object.keys(state?.bots || {});

    if (botIds.length > 0) {
        // 2. Elegimos una clave (ID) al azar
        const randomIndex = Math.floor(Math.random() * botIds.length);
        const randomBotId = botIds[randomIndex];

        // 3. Copiamos el objeto y eliminamos la propiedad elegida
        const updatedBots = { ...state.bots };
        delete updatedBots[randomBotId];

        // 4. Actualizamos el estado
        state.bots = updatedBots;

        // 5. Emitimos el estado actualizado
        socket.server.emit('bot:remove', state.bots);
        console.log(`[BOT] Se eliminó el bot con ID: ${randomBotId}`);
    }
};

export const handleBotToggleMovement = async (socket) => {
    state.movementBot = !state.movementBot;

    socket.server.emit('bot:toggleMovement', state.movementBot);
    console.log(`[BOT] Movimiento de BOT: ${state.movementBot}`);
};