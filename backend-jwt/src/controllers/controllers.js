import { newConnection } from "../db/database.js";

import { generarJwt } from "../helpers/generar-jwt.js";

export async function login(req, res) {
  const { username, password } = req.body;

  try {
    // Conexión a la base de datos
    const conexion = await newConnection();

    // Consulta a la base de datos
    const [usuario] = await conexion.query(
      "SELECT * FROM users WHERE username = ? AND password = ?",
      [username, password]
    );

    const user = usuario[0]; // Tomamos el primer usuario encontrado

    // Validación de usuario
    if (!user) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    // Generar token JWT de forma asíncrona
    const token = await generarJwt(usuario[0].id);

    // Almacenar el token en la sesión del servidor
    console.log(req.session);
    req.session.token = token;

    // Almacenar el token en una cookie segura
    res.cookie("authToken", token, {
      httpOnly: true, // La cookie no es accesible desde JavaScript
      secure: false, // Cambiar a true en producción con HTTPS
      maxAge: 3600000, // Expiración en milisegundos (1 hora)
    });

    return res.json({ message: "Inicio de sesión exitoso" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error Inesperado" });
  }
}

export function session(req, res) {
  console.log(req.user);
  return res.json({
    message: "Acceso permitido a área protegida",
    user: req.user,
  });
}

export function logout(req, res) {
  try {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Error al cerrar sesión" });
      }

      res.clearCookie("authToken");
      return res.json({ message: "Cierre de sesión exitoso" });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error Inesperado" });
  }
}

export async function register (req, res) {
  const { username, password } = req.body;
  const conexion = await newConnection();

  try {
    // Verificar si el usuario ya existe
    const [existingUser] = await conexion.query("SELECT * FROM users WHERE username = ?", [username]);

    if (existingUser.length > 0) {
      // Si ya existe, retornar error 409
      return res.status(409).json({ message: "El nombre de usuario ya existe, por favor elija otro" });
    }

    // Si no existe, insertar el nuevo usuario
    const [newUser] = await conexion.query("INSERT INTO users (username, password) VALUES (?, ?)", [username, password]);

    // Retornar éxito
    return res.status(201).json({ message: "Usuario creado correctamente", data: newUser });
  } catch (error) {
    console.error("Error al registrar usuario: ", error);
    return res.status(500).json({ message: "Error del servidor" });
  } finally {
    await conexion.end(); // Asegúrate de cerrar la conexión
  }
}