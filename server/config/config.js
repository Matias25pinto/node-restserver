//=============================
// PUERTO
//=============================
// Es una variable Global
process.env.PORT = process.env.PORT || 3000; // De esta forma verificamos en cual puerto esta corriendo nuestra aplicacion

//=============================
// ENTORNO
//=============================
// Variable global de las cadenas de conexion

process.env.NODE_ENV = process.env.NODE_ENV || "dev"; // para saber si estoy en desarrollo(local) o en producción

//=============================
// Vencimiento del token
//=============================
//60 segundos
//60 minutos
//24 horas
//30 días
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

//=============================
// SEED de autenticación
//=============================
process.env.SEED = process.env.SEED || "este-es-el-seed-desarrollo";

let urlDB;

if (process.env.NODE_ENV === "dev") {
  urlDB = "mongodb://localhost:27017/cafe";
} else {
  urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;
