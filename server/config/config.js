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
//process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;
process.env.CADUCIDAD_TOKEN = '48h';
//=============================
// SEED de autenticación
//=============================
process.env.SEED = process.env.SEED || "este-es-el-seed-desarrollo";

//=============================
// CLIENT_ID
//=============================
process.env.CLIENT_ID =
  process.env.CLIENT_ID ||
  "84377457215-l3bjkauvqd1a04hffbjq9a2oq788iveg.apps.googleusercontent.com";
let urlDB;
//tiene que ir en el if para detectar si es en modo producción o en modo desarrollo
//process.env.NODE_ENV === "dev"
if (false) {
  urlDB = "mongodb://localhost:27017/cafe";
} else {
  urlDB = process.env.MONGO_URI || "mongodb+srv://matias25pinto:aspire5734z@cluster0.hmxoq.mongodb.net/cafe?retryWrites=true&w=majority";
}

process.env.URLDB = urlDB;
