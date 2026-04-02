// 1. Cambiamos require por import y añadimos .js
import state from '../entities/GameStage.js';
import Player from '../models/Player.js';
import { calcRandomPosition, getBody } from '../utils.js';

export const handleLogin = async (socket, io, data) => {
  try {
    const payload = getBody(data);
    const name = payload?.name;

    if (!name) {
      return socket.emit('player:login:error', { message: 'Nombre requerido' });
    }

    // Buscamos la plantilla real en la DB
    const templatePlayer = await Player.findOne({ name: 'player_default' }).lean();

    if (!templatePlayer) {
      console.warn(`⚠️ Intento de login fallido: No existe 'player_default' en la DB.`);
      return socket.emit('player:login:error', { message: 'Personaje base no encontrado.' });
    }

    const randomPosition = calcRandomPosition(templatePlayer.map);

    // Cargamos en RAM del servidor
    state.players[socket.id] = {
      ...templatePlayer,
      socketId: socket.id,
      name,
      position: randomPosition
    };

    // ENVIA AL CLIENTE: Sus datos y la lista de quiénes YA estaban
    socket.emit('player:login:success', {
      player: state.players[socket.id],
      playerList: Object.values(state.players).filter(p => p.socketId !== socket.id)
    });

    // ENVIA A TODOS LOS DEMÁS: "Dibujad a este nuevo jugador"
    socket.broadcast.emit('player:add', state.players[socket.id]);

    // LOG DEL SV
    console.log(`[Login] ${name} entró al mundo Priego Online.`);
  } catch (error) {
    socket.emit('player:login:error', { message: 'Error de formato o servidor.' });
    console.error('❌ Error en player login:', error);
  }
};

export const handleLogout = (socket, io) => {
  const player = state.players[socket.id];

  if (player) {
    const playerName = player.name;

    // Eliminamos de la RAM
    delete state.players[socket.id];

    // Avisamos a los demás para que des-rendericen el sprite
    io.emit('player:remove', socket.id);

    // LOG DEL SV
    console.log(`[Logout] ${playerName} se ha desconectado.`);
  }
};