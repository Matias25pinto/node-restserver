const express = require('express');

const bcrypt = require('bcrypt');

const _ = require('underscore'); // por standar el undercore se usa _, vamos utilizar una funcion que permite filtrar elementos de un objeto

const Usuario = require('../models/usuario');

const app = express();

app.get('/usuario', function(req, res) {

    let condicion = {
        estado: true
    }

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find(condicion, 'nombre email role estado google img')
        .skip(desde) // sirve para saltar se le indica la cantidad de elementos quieres saltar
        .limit(limite) // limite de la cantidad de usuarios solicitados
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.count(condicion, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    totalUsuarios: conteo
                });
            });

        });
});

app.post('/usuario', function(req, res) {

    let body = req.body; // OBTIENE la informacion que viene en el BODY, FUNCIONA PARA POST, PUT, Y DELETE

    // crear el objeto que se va enviar en la base de datos
    let ususario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    }); // crea un nuevo usuario con el Schema

    ususario.save((err, usuarioBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        } else {
            res.json({
                ok: true,
                usuario: usuarioBD
            });
        }

    });
});

app.put('/usuario/:id', function(req, res) {

    let id = req.params.id; // para obtener el parametro
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']); //la funcion pick de undercore, permite filtrar solo las propiedades que quiero del objeto

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioBD) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            usuario: usuarioBD
        });
    });
});

app.delete('/usuario/:id', function(req, res) {

    let id = req.params.id; // oara obtener el parametro que viene por url

    /*
        // Eliminar el usuario fisicamente de la BD
    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            })
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
    */

    // Eliminar el usuario cambiando el estado de true a false

    let cambiarEstado = {
        estado: false
    }

    Usuario.findByIdAndUpdate(id, cambiarEstado, { new: true }, (err, usuarioBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });

})

module.exports = app;