const express = require("express");

const fs = require("fs");

const path = require("path");

const {
  verificaToken,
  verificaTokenImg,
} = require("../Middlewares/autenticacion");

const app = express();

app.get("/imagen/:tipo/:img", verificaTokenImg, (req, res) => {
  let tipo = req.params.tipo;
  let img = req.params.img;

  //Crear el path absoluto de la imagen
  let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);

  //Verificar si existe el path de la imagen

  if (fs.existsSync(pathImagen)) {
    res.sendFile(pathImagen);
  } else {
    //construir path absoluto
    let noImagePath = path.resolve(__dirname, "../assets/no-image.jpg");

    res.sendFile(noImagePath);
  }
});

module.exports = app;
