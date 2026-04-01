const Player = require('../models/Player');
const state = require('../entities/GameStage');

const handleLogin = async (socket, io, data) => {
  try {
    // Soporte para body (por si viene de tu herramienta de testeo)
    const payload =
      typeof data.body === 'string' ? JSON.parse(data.body) : data.body || data;
    const { name } = payload;

    if (!name)
      return socket.emit('login:error', { message: 'Nombre requerido' });

    // Buscamos la plantilla real en la DB
    const templatePlayer = await Player.findOne({ name: '' }).lean();

    if (!templatePlayer) {
      console.log(`[Login] Fallido: No se recupero el player por defecto`);
      return socket.emit('login:error', {
        message: 'Personaje no encontrado.',
      });
    }

    // Cargamos en RAM
    state.players[socket.id] = { ...templatePlayer, name, id: socket.id };

    //ENVIA AL CLIENTE
    socket.emit('login:success', {
      player: state.players[socket.id],
      playerList: Object.values(state.players).filter(p => p.socketId !== socket.id) ?? []
    });

    //ENVIA A TODOS MENOS AL CLIENTE
    io.except(socket.id).emit('player:add', state.players[socket.id]);

    console.log(`[Login] ${name} entró al mundo Priego Online.`);
  } catch (error) {
    socket.emit('login:error', { message: 'Error de formato o servidor.' });

    console.error('❌ Error en login:', error);
  }
};

const handleLogout = (socket) => {
  const player = state?.players[socket.id];

  if (player) {
    console.log(`[Logout] ${player.name} se ha desconectado.`);
    delete state.players[socket.id];
  }
};

module.exports = { handleLogin, handleLogout };
