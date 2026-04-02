const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    clan: { type: String, default: "" },
    direction: { type: Number, default: 0 },
    map: { type: Number, default: 0 },
    position: { x: Number, y: Number },
    default_head: Number,
    head: Number,
    default_body: Number,
    body: Number,
    lvl: { type: Number, default: 1 },
    exp: { type: Number, default: 0 },
    topExp: { type: Number, default: 0 },
    gold: { type: Number, default: 0 },
    kills: { type: Number, default: 0 },
    dragCreditos: { type: Number, default: 0 },
    hp: { type: Number, default: 100 },
    maxHp: { type: Number, default: 100 },
    mana: { type: Number, default: 0 },
    maxMana: { type: Number, default: 0 },
    energia: { type: Number, default: 1000 },
    maxEnergia: { type: Number, default: 1000 },
    hambre: { type: Number, default: 200 },
    maxHambre: { type: Number, default: 200 },
    sed: { type: Number, default: 200 },
    maxSed: { type: Number, default: 200 },
    text: {
        message: { type: String, default: "" },
        isSpell: { type: Boolean, default: false }
    },
    items: {
        type: [mongoose.Schema.Types.Mixed],
        default: () => {
            const inv = new Array(42).fill({});

            inv[0] = { id: "0", type: 1, inUse: true };
            return inv;
        }
    },
    spells: {
        type: [mongoose.Schema.Types.Mixed],
        default: () => {
            const spells = new Array(30).fill({});

            spells[0] = { id: "0" };
            spells[0] = { id: "1" };
            return inv;
        }
    },
});

module.exports = mongoose.model('Player', PlayerSchema);