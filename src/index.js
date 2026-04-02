require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const socketEvents = require('./network/index');

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

// --- CONEXIÓN A DB Y ARRANQUE ---
mongoose.connect(MONGO_URI).then(() => {
    // Solo arrancamos el servidor HTTP/Sockets si la DB está lista
    server.listen(PORT, () => {
        console.log(`\n===========================================`);
        console.log(`   Conectado a MongoDB LOCAL (127.0.0.1)   `);
        console.log(` SERVIDOR RPG ONLINE CORRIENDO EN ${PORT}  `);
        console.log(`----------SERVIDOR CREADO POR HEDA---------`);
        console.log(`                @PABLOLB27                 `);
        console.log(`===========================================\n`);
    });
}).catch(err => {
    console.error("❌ Error crítico al conectar a MongoDB:");
    console.error(err.message);
    process.exit(1); // Cerramos el proceso si no hay DB
});