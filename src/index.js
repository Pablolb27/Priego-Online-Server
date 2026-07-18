import cors from 'cors'; // Corregido: De require a import
import 'dotenv/config';
import express from 'express';
import http from 'http';
import mongoose from 'mongoose'; // Corregido: Importación estándar
import { Server } from 'socket.io';

// IMPORTANTE: En ESM siempre debes poner la extensión .js en tus archivos locales
import { loadMaps } from './loaders/loadMaps.js';
import { socketEvents } from './network/index.js';

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// --- EL WORLD TICK ---
setInterval(() => {
    // updateWorld(io);
}, 100);

// --- GESTIÓN DE CONEXIONES ---
io.on('connection', (socket) => {
    socketEvents(io, socket);
});

// --- VARIABLES DE ENTORNO ---
const PORT = process.env.PORT || 7666;
const MONGO_URI = process.env.MONGO_URI;

// --- CONEXIÓN A DB Y ENRUTAMIENTO ---
if (!MONGO_URI) {
    console.error("❌ Error crítico: MONGO_URI es undefined en las variables de entorno de Vercel.");
} else {
    mongoose.connect(MONGO_URI).then(() => {
        // En Vercel verás este log en la pestaña "Logs" cuando llegue la primera petición
        console.log(`\n===========================================`);
        console.log(`     Conectado a MongoDB ATLAS (Nube)      `);
        console.log(`   SERVIDOR EN VERCEL INICIALIZADO         `);
        console.log(`----------SERVIDOR CREADO POR HEDA---------`);
        console.log(`                @PABLOLB27                 `);
        console.log(`===========================================\n`);
        
        // Cargamos recursos (aunque pasemos de ellos ahora, que no rompa)
        loadMaps();
    }).catch(err => {
        console.error("❌ Error crítico al conectar a MongoDB:", err.message);
    });
}
