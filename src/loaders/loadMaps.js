import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as CONST from '../const.js';
import gameStage from '../entities/GameStage.js';

// --- CONFIGURACIÓN PARA ESM ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Recorre una lista de mapas y los guarda procesados en gameStage.maps
 * @param {Array<string>} mapNames - Lista de nombres de archivos (sin .json)
 */
export const loadMaps = () => {
    console.log("🗺️ Cargando mapas...");

    for (let numMap = 0; numMap < CONST.numMaps; numMap++) {
        try {
            const filePath = path.join(__dirname, `../data/maps/map_${numMap}.json`);
            const rawData = fs.readFileSync(filePath, 'utf-8');
            const mapJson = JSON.parse(rawData);

            gameStage.maps[numMap] = mapJson;
        } catch (error) {
            console.error(`❌ Error al cargar el mapa ${mapName}:`, error.message);
        }
    }
};
