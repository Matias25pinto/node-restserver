const express = require("express");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const { OAuth2Client } = require("google-auth-library"); //libreria para verificar el token de google
const client = new OAuth2Client(process.env.CLIENT_ID);

const Usuario = require("../models/usuario");
const usuario = require("../models/usuario");

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

//Configuración de google
async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  return {
    nombre: payload.name,
    email: payload.email,
    img: payload.picture,
    google: true,
  };
}

app.post("/google", async (req, res) => {
  let token = req.body.idtoken;

  let googleUser = await verify(token).catch((err) => {
    return res.status(403).json({
      ok: false,
      err: err,
    });
  });
  Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (usuarioDB) {
      if (usuarioDB.google === false) {
        return res.status(400).json({
          ok: false,
          err: {
            message: "Debe de usar su autenticación normal",
          },
        });
      } else {
        //Generar token
        let token = jwt.sign(
          {
            usuario: usuarioDB,
          },
          process.env.SEED,
          { expiresIn: process.env.CADUCIDAD_TOKEN }
        );
        return res.status(200).json({
          ok: true,
          usuario: usuarioDB,
          token,
        });
      }
    } else {
      //Si el usuario no existe en nuestra base de datos seria un nuevo usuario
      let usuario = new Usuario();

      usuario.nombre = googleUser.nombre;
      usuario.email = googleUser.email;
      usuario.img = googleUser.img;
      usuario.google = true;
      usuario.password = ":)";

      usuario.save((err, usuarioDB) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            err,
          });
        }
        //Generar token
        let token = jwt.sign(
          {
            usuario: usuarioDB,
          },
          process.env.SEED,
          { expiresIn: process.env.CADUCIDAD_TOKEN }
        );
        return res.status(200).json({
          ok: true,
          usuario: usuarioDB,
          token,
        });
      });
    }
  });
});

module.exports = app;
