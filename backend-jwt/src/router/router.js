import { Router } from "express";
import { login, logout, register, session } from "../controllers/controllers.js";
import { verificarJwt } from "../middlewares/validar-jwt.js";
export const ruta = Router();
ruta.post("/login", login);

ruta.get("/session", verificarJwt, session);

// Endpoint de cierre de sesión (logout)
ruta.post("/logout", logout);

ruta.post("/registro", register)

