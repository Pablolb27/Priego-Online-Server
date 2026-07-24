import state from '../entities/GameStage.js';
import { getBody } from '../utils.js';

export const playerMovement = (socket, data) => {
    const newPosition = getBody(data).position;
    const newDirection = getBody(data).direction;

    state.players[socket.id].direction = newDirection;
    state.players[socket.id].newPosition = newPosition;

    const playerEmit = { ...state.players[socket.id] };

    state.players[socket.id].position = newPosition;
    state.players[socket.id].newPosition = null;

    socket.broadcast.emit('player:updatePosition', playerEmit);
}

export const botMovement = (socket, data) => {
    const newPosition = getBody(data).position;
    const newDirection = getBody(data).direction;

    state.players[socket.id].direction = newDirection;
    state.players[socket.id].newPosition = newPosition;

    const playerEmit = { ...state.players[socket.id] };

    state.players[socket.id].position = newPosition;
    state.players[socket.id].newPosition = null;

    socket.broadcast.emit('player:updatePosition', playerEmit);
}