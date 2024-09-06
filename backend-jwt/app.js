// server.js
import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import cors from 'cors';
import morgan from 'morgan';
import { ruta } from './src/router/router.js';
import { valoresBD } from './src/config/env.js';

const app = express();

app.use(cors({
    origin: ['http://localhost:5500', 'http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: valoresBD.SECRET_SESSION, // Cambia esto por una clave secreta en producción
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Usar 'true' si usas HTTPS
}));

app.use(ruta)

// Endpoint de inicio de sesión (login)


// Servidor escuchando
app.listen(valoresBD.PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${valoresBD.PORT}`);
});
