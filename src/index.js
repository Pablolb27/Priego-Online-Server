import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import { Server } from 'socket.io';

import { loadMaps } from './loaders/loadMaps.js';
import { socketEvents } from './network/index.js';

const app = express();

// CORS configurado para aceptar tu cliente de Vercel en producción
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? 'https://priego-online.vercel.app' : '*',
    credentials: true
}));

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.NODE_ENV === 'production' ? 'https://priego-online.vercel.app' : '*',
        methods: ["GET", "POST"],
        credentials: true
    }
});

// --- EL WORLD TICK (10 ticks por segundo para la lógica del AO) ---
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

// Endpoint de control rápido para ver desde el navegador si el backend responde
app.get('/', (req, res) => {
    res.json({
        status: "Servidor de Priego-Online activo",
        entorno: process.env.NODE_ENV === 'production' ? 'PROD (Render)' : 'LOCAL (Dev)',
        db: mongoose.connection.readyState === 1 ? "Conectado con éxito" : "Desconectado/Conectando"
    });
});

// --- VALIDACIÓN Y ARRANQUE UNIFICADO ---
if (!MONGO_URI) {
    console.error("❌ Error crítico: MONGO_URI no está definida en las variables de entorno.");
    process.exit(1);
}

// UN SOLO LISTEN: Levanta el puerto al instante (así Render no te mete timeout por puerto cerrado)
server.listen(PORT, () => {
    const isLocal = !process.env.PORT;
    console.log(`\n===========================================`);
    console.log(` SERVIDOR RPG ONLINE ESCUCHANDO EN PUERTO ${PORT}`);
    console.log(`----------SERVIDOR CREADO POR HEDA---------`);
    console.log(`                 @PABLOLB27                `);
    console.log(`===========================================\n`);

    console.log("🔋 Iniciando conexión con base de datos remota...");

    // Conectamos a Mongo Atlas y cargamos mapas en segundo plano sin bloquear el puerto
    mongoose.connect(MONGO_URI)
        .then(() => {
            console.log(`📦 DB: Conectado con éxito a MongoDB (${isLocal ? 'LOCAL' : 'ATLAS NUBE'})`);
            console.log(`🗺️ Cargando mapas de Priego-Online en memoria...`);
            loadMaps();
            console.log(`✅ ¡Mapas cargados y listos para los jugadores!`);
        })
        .catch(err => {
            console.error("❌ Error crítico diferido en MongoDB:");
            console.error(err.message);
            process.exit(1);
        });
});