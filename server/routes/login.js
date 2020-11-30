const express = require("express");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const Usuario = require("../models/usuario");

const app = express();

//peticion post
app.post("/login", (req, res) => {
  let body = req.body; // recibimos lo que esta en el body de la peticion

  // capturamos el email del usuario
  Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
    //de esta forma tratamos el error
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    //verificar si el usuario es incorrecto
    if (!usuarioDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "(Usuario) o Contraseña incorrectos",
        },
      });
    }
    //verificar si la contraseña es correcta
    if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "Usuario o (Contraseña) incorrectos",
        },
      });
    }
    // generar token
    let token = jwt.sign(
      {
        usuario: usuarioDB,
      },
      process.env.SEED,
      { expiresIn: process.env.CADUCIDAD_TOKEN }
    );
    // respuesta si todo es correcto
    res.json({
      ok: true,
      usuario: usuarioDB,
      token,
    });
  });
});

module.exports = app;
