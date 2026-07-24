import { TYPE_OBJ } from '../const.js';
import state from '../entities/GameStage.js';
import ObjsData from './../data/obj.json' with { type: "json" };

export const toggleEquipar = (socket, data) => {
    const player = state.players[socket.id];
    const obj = ObjsData[data.id];

    if (data.isEquipado) {
        desEquiparArmadura(player, obj);
        socket.emit('player:updateMe', { player });
        socket.broadcast.emit('player:update', state.players[socket.id]);
    } else {
        equiparItem(player, obj);
        socket.emit('player:updateMe', { player });
        socket.broadcast.emit('player:update', state.players[socket.id]);
    }
}

export const equiparItem = (player, obj) => {
    switch (obj.type) {
        case TYPE_OBJ.ARMADURA:
            equiparArmadura(player, obj);
            break;
    }
}

export const desEquiparItem = (player, obj) => {
    switch (obj.type) {
        case TYPE_OBJ.ARMADURA:
            desEquiparArmadura(player, obj);
            break;
    }
}

export const equiparArmadura = (player, obj) => {
    player.items[0].inUse = true;
    player.body = obj.body;
}

export const desEquiparArmadura = (player, obj) => {
    player.items[0].inUse = false;
    player.body = player.default_body;
}