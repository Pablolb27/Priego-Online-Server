import mapsData from './data/maps.json' with { type: "json" };
import state from './entities/GameStage.js';

export const getBody = (data) => {
    return typeof data.body === 'string' ? JSON.parse(data.body) : data.body || data;
}

export const calcRandomPosition = (map) => {
    const mapData = mapsData[map];
    let x;
    let y;

    do {
        x = Math.floor(Math.random() * mapData.maxX);
        y = Math.floor(Math.random() * mapData.maxY);
    } while (isLegalPosition(map, x, y));

    return { x, y };
}

export const isLegalPosition = (map, x, y) => {
    return state.maps[map][x][y].isBloqued;
}