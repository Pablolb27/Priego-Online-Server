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
        console.log(`\n===========================================`);
        console.log(`     Conectado a MongoDB ATLAS (Nube)      `);
        console.log(`   SERVIDOR EN VERCEL INICIALIZADO         `);
        console.log(`----------SERVIDOR CREADO POR HEDA---------`);
        console.log(`                @PABLOLB27                 `);
        console.log(`===========================================\n`);
        
        loadMaps();
    }).catch(err => {
        console.error("❌ Error crítico al conectar a MongoDB:", err.message);
    });
}

// Endpoint de control
app.get('/', (req, res) => {
    res.json({ 
        status: "Servidor de Priego-Online activo en Vercel", 
        db: mongoose.connection.readyState === 1 ? "Conectado" : "Conectando/Desconectado" 
    });
});

// Solo escuchamos en puerto si NO estamos en producción
if (process.env.NODE_ENV !== 'production') {
    server.listen(PORT, () => {
        console.log(`Servidor corriendo localmente en el puerto ${PORT}`);
    });
}

// PARA ASEGURAR EN VERCEL: Exportamos tanto por default como con CommonJS compatible
export default app;
