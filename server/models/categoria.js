const mongoose = require("mongoose"); // importar mongoose
const uniqueValidator = require("mongoose-unique-validator");

let Schema = mongoose.Schema; // crear un Schema, que nos va permitir formatear nuestro documento de MongoDB

// Creamos nuestro objeto esquema con todas sus propiedades
let categoriaSchema = new Schema({
  descripcion: {
    type: String,
    unique: true, //indicamos que el atributo debe ser unico
    required: [true, "La descripcion es necesaria"],
  },
  usuario: {
    type: String,
    required: [true, "El usuario es obligatorio"],
  },
});

categoriaSchema.plugin(uniqueValidator, {
  message: "{PATH} debe de ser único",
}); // le decimos al Scheme que use un plugin

module.exports = mongoose.model("Categoria", categoriaSchema); // Exportar el modelo
