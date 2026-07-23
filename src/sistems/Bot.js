// src/ai/BotManager.js
import { DIRECTIONS } from '../const.js';
import state from '../entities/GameStage.js';
import Player from '../models/Player.js';
import { calcRandomPosition, isLegalPosition } from '../utils.js';

export const botAdd = async (socket) => {
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

export const botRemove = (socket) => {
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

export const botToggleMovement = (socket) => {
    state.movementBot = !state.movementBot;

    socket.server.emit('bot:toggleMovement', state.movementBot);
    console.log(`[BOT] Movimiento de BOT: ${state.movementBot}`);
};

export const calcMovementBOT = (io) => {
    if (!Object.keys(state?.bots || {}).length || !state.movementBot) {
        return;
    }

    for (const botId in state.bots) {
        const bot = state.bots[botId];

        if (bot.dead) continue;

        const randomMove = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
        const nextX = bot.position.x + randomMove.dx;
        const nextY = bot.position.y + randomMove.dy;

        if (isLegalPosition(bot.map, nextX, nextY)) {
            // 1. Liberamos la casilla antigua
            if (state.maps[bot.map]?.[bot.position.x]?.[bot.position.y]) {
                delete state.maps[bot.map][bot.position.x][bot.position.y].isBlocked;
            }

            // 2. Actualizamos el estado real en memoria del servidor
            bot.position = { x: nextX, y: nextY };
            bot.direction = randomMove.dir;

            // 3. Bloqueamos la nueva casilla
            state.maps[bot.map][nextX][nextY].isBlocked = bot.id;

            // 4. EMITIMOS A TODOS LOS CLIENTES CONECTADOS
            io.emit('bot:move', {
                id: bot.id,
                position: bot.position,
                direction: bot.direction,
            });
        }
    }
};
