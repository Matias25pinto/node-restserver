require("./config/config"); // leer el archivo confi, y ejecutarlo, para poder usar las variables globales

// Using Node.js `require()`
const mongoose = require("mongoose");

//para crear path
const path = require("path");

const express = require("express");
const app = express();
// BodyParser
const bodyParser = require("body-parser"); // Es un paquete que nos permite leer lo enviado en el body
const { use } = require("./routes/usuario");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false })); // es un middleware

// parse application/json
app.use(bodyParser.json()); // es un middleware

//Habilitar carpeta public
app.use(express.static(path.resolve(__dirname, "../public")));

// configuración de rutas
app.use(require("./routes/index"));

// Conexion a mongoDB
mongoose.connect(
  process.env.URLDB,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  },
  (err, res) => {
    if (err) throw new err(); //Genera un error si err es positivo

    console.log("Base de datos ONLINE");
  }
);
// Le decimos a expres en que puerto correra nuestra aplicaciòn
app.listen(process.env.PORT, () => {
  console.log(`Escuchando puerto: ${process.env.PORT}`);
});
