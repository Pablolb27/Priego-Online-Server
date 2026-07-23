export const chatGeneral = (socket, data) => {
    const message = getBody(data).message;
    const response = {
        playerId: socket.id,
        message
    }

    state.players[socket.id].text = { message };

    setTimeout(() => {
        state.players[socket.id].text = {};
    }, 5000);

    socket.broadcast.emit('player:chat', response);
}