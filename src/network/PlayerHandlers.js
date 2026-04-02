import state from '../entities/GameStage.js';
import Player from '../models/Player.js';
import { calcRandomPosition, getBody } from '../utils.js';

export const handleLogin = async (socket, io, data) => {
  try {
    const name = getBody(data)?.name;
    const templatePlayer = await Player.findOne({ name: 'player_default' }).lean();
    const position = calcRandomPosition(templatePlayer.map);

    if (!name || !templatePlayer) {
      return socket.emit('player:login:error', { message: 'Error al hacer Login.' });
    }

    // CARGAMOS EL PERSONAJE EN EL STATE
    state.players[socket.id] = {
      ...templatePlayer,
      socketId: socket.id,
      name,
      position
    };

    // ACTUALIZAMOS EL MAPA EN EL STATE
    state.maps[templatePlayer.map][position.x][position.y].isBloqued = socket.id;

    // ENVIA AL CLIENTE
    socket.emit('player:login:success', {
      player: state.players[socket.id],
      playerList: Object.values(state.players).filter(p => p.socketId !== socket.id)
    });

    // ENVIA A TODOS LOS DEMÁS
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

    // ELIMINAMOS DEL STATE
    delete state.players[socket.id];
    delete state.maps[player.map][player.position.x][player.position.y].isBloqued;

    //ENVIAMOS A TODOS LOS CLIENTES
    io.emit('player:remove', socket.id);

    // LOG DEL SV
    console.log(`[Logout] ${playerName} se ha desconectado.`);
  }
};