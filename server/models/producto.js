var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var productoSchema = new Schema({
  nombre: { type: String, required: [true, "El nombre es necesario"] },
  precioUni: {
    type: Number,
    required: [true, "El precio únitario es necesario"],
  },
  descripcion: { type: String, required: false },
  disponible: { type: Boolean, required: true, default: true },
  categoria: { type: Schema.Types.ObjectId, ref: "Categoria", required: true }, //para validar que sea el id de un objeto que exista en ese Schema
  img: { type: String, required: false },
  usuario: { type: Schema.Types.ObjectId, ref: "Usuario" }, //Para validar que sea el id de un objeto que existe en ese Schema
});

module.exports = mongoose.model("Producto", productoSchema);
