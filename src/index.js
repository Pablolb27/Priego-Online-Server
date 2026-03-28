// src/index.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

// Importamos nuestros módulos de sistema
const socketEvents = require('./network/socketEvents');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // En producción cambia esto a la URL de tu cliente
        methods: ["GET", "POST"]
    }
});

// --- EL WORLD TICK (Bucle Maestro) ---
// Este intervalo corre independientemente de si hay gente conectada o no.
setInterval(() => {
    //updateWorld(io);
}, 100);

// --- GESTIÓN DE CONEXIONES ---
io.on('connection', (socket) => {
    console.log(`[Network] Nuevo cliente conectado: ${socket.id}`);
    socketEvents(io, socket);
});

// --- ARRANQUE DEL SERVIDOR ---
const PORT = process.env.PORT || 7666;
server.listen(PORT, () => {
    console.log(`===========================================`);
    console.log(`  SERVIDOR RPG ONLINE CORRIENDO EN ${PORT} `);
    console.log(`===========================================`);
});