const Player = require('../models/Player');
const state = require('../entities/GameStage');
const { getBody, calcRandomPosition } = require('../utils');

const handleLogin = async (socket, io, data) => {
  try {
    // Soporte para body (por si viene de tu herramienta de testeo)
    const payload = getBody(data);
    const { name } = payload;

    if (!name) {
      return socket.emit('player:login:error', { message: 'Nombre requerido' });
    }

    // Buscamos la plantilla real en la DB
    const templatePlayer = await Player.findOne({ name: 'player_default' }).lean();

    if (!templatePlayer) {
      return socket.emit('player:login:error', { message: 'Personaje no encontrado.' });
    }

    const randomPosition = calcRandomPosition(templatePlayer.map);

    // Cargamos en RAM
    state.players[socket.id] = {
      ...templatePlayer,
      id: socket.id,
      name,
      position: randomPosition
    };

    //ENVIA AL CLIENTE
    socket.emit('player:login:success', {
      player: state.players[socket.id],
      playerList: Object.values(state.players).filter(p => p.socketId !== socket.id) ?? []
    });

    //ENVIA A TODOS MENOS AL CLIENTE
    io.except(socket.id).emit('player:add', state.players[socket.id]);

    //LOG DEL SV
    console.log(`[Login] ${name} entró al mundo Priego Online.`);
  } catch (error) {
    socket.emit('playerlogin:error', { message: 'Error de formato o servidor.' });

    //LOG DEL SV
    console.error('❌ Error en player login:', error);
  }
};

const handleLogout = (socket, io) => {
  const player = state?.players[socket.id];

  if (player) {
    delete state.players[socket.id];

    //ENVIO DESCONEXION A PLAYERS
    io.except(socket.id).emit('player:remove', socket.id);

    //LOG DEL SV
    console.log(`[Logout] ${player.name} se ha desconectado.`);
  }
};

module.exports = { handleLogin, handleLogout };
