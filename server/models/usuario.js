const mongoose = require('mongoose'); // importar mongoose
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema; // crear un Schema, que nos va permitir formatear nuestro documento de MongoDB

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
}

// Creamos nuestro objeto esquema con todas sus propiedades 
let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});
// vamos a evitar que el Json que se devuelve muestre informacion del password

usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}
usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' }); // le decimos al Scheme que use un plugin 

module.exports = mongoose.model('Usuario', usuarioSchema); // Exportar el modelo