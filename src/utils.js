import mapsData from './data/indices/maps.json' with { type: "json" };

export const getBody = (data) => {
    return typeof data.body === 'string' ? JSON.parse(data.body) : data.body || data;
}

export const calcRandomPosition = (map) => {
    const mapData = mapsData[map];
    const randomPosition = {
        x: Math.floor(Math.random() * mapData.maxX),
        y: Math.floor(Math.random() * mapData.maxY)
    };

    return randomPosition;
}