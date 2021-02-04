const mongoose = require("mongoose"); // importar mongoose
const uniqueValidator = require("mongoose-unique-validator");

let Schema = mongoose.Schema; // crear un Schema, que nos va permitir formatear nuestro documento de MongoDB

let rolesValidos = {
  values: ["ADMIN_ROLE", "USER_ROLE"],
  message: "{VALUE} no es un rol válido",
};

// Creamos nuestro objeto esquema con todas sus propiedades
let usuarioSchema = new Schema({
  nombre: {
    type: String, // indica el tipo del atributo
    required: [true, "El nombre es necesario"], //indica que el atributo es obligatorio y el mensaje si no lo carga
  },
  email: {
    type: String,
    unique: true, // indica que el atributo debe ser unico
    required: [true, "El correo es necesario"],
  },
  password: {
    type: String,
    required: [true, "La contraseña es obligatoria"],
  },
  img: {
    type: String,
    required: false, // indica que el atributo no es obligatorio
  },
  role: {
    type: String,
    default: "USER_ROLE", // indica cual va ser su valor por defecto si no lo carga
    enum: rolesValidos, // se carga un objeto que contiene cuales son los roles validos
  },
  estado: {
    type: Boolean,
    default: true,
  },
  google: {
    type: Boolean,
    default: false,
  },
});
// vamos a evitar que el Json que se devuelve muestre informacion del password

usuarioSchema.methods.toJSON = function () {
  let user = this;
  let userObject = user.toObject();
  delete userObject.password;

  return userObject;
};
usuarioSchema.plugin(uniqueValidator, { message: "{PATH} debe de ser único" }); // le decimos al Scheme que use un plugin

module.exports = mongoose.model("Usuario", usuarioSchema); // Exportar el modelo
