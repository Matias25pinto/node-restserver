const express = require("express");
const fileUpload = require("express-fileupload");
const Usuario = require("../models/usuario");
const Producto = require("../models/producto");
const fs = require("fs"); //importar el file system
const path = require("path"); //importar el path
const app = express();

// default options
app.use(fileUpload()); // Hace que todo lo que se suba lo coloca en un objeto req.files

app.put("/upload/:tipo/:id", function (req, res) {
  let tipo = req.params.tipo;
  let id = req.params.id;
  //Validar tipo
  let tiposValidos = ["productos", "usuarios"];
  if (tiposValidos.indexOf(tipo) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message: "Los tipos permitidas son: " + tiposValidos.join(", "),
      },
    });
  }
  let archivo;
  let uploadPath;
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message: "No se ha seleccionado ningún archivo",
      },
    });
  }
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  //Cambiamos el sampleFile por archivo
  archivo = req.files.archivo;

  //Extensiones validas
  let extensionesValidas = ["png", "gif", "jpg", "jpeg"];
  let nombreCortado = archivo.name.split("."); //creamos un arreglo divido en donde encuentre .
  let extension = nombreCortado[nombreCortado.length - 1];

  if (extensionesValidas.indexOf(extension) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message:
          "Las extensiones permitidas son: " + extensionesValidas.join(", "),
        ext: extension,
      },
    });
  }
  //Cambiar nombre al archivo
  let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;
  uploadPath = `uploads/${tipo}/${nombreArchivo}`;

  // Use the mv() method to place the file somewhere on your server
  archivo.mv(uploadPath, function (err) {
    if (err)
      return res.status(500).json({
        ok: false,
        err,
      });

    if (tipo === "usuarios") {
      //Aquí la imagen ya se cargo
      imagenUsuario(id, res, nombreArchivo);
    } else if (tipo === "productos") {
      imagenProducto(id, res, nombreArchivo);
    }
  });
});
function imagenProducto(id, res, nombreArchivo) {
  Producto.findById(id, (err, productoBD) => {
    if (err) {
      borrarArchivo(nombreArchivo, "productos");
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    if (!productoBD) {
      borrarArchivo(nombreArchivo, "productos");
      return res.status(400).json({
        ok: false,
        err: {
          message: "El id producto no existe",
        },
      });
    }

    borrarArchivo(productoBD.img, "productos");

    productoBD.img = nombreArchivo;
    productoBD.save((err, productoUpdate) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }
      res.json({
        ok: true,
        producto: productoUpdate,
        img: productoBD.img,
      });
    });
  });
}

function imagenUsuario(id, res, nombreArchivo) {
  Usuario.findById(id, (err, usuarioBD) => {
    if (err) {
      borrarArchivo(nombreArchivo, "usuarios");
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    if (!usuarioBD) {
      borrarArchivo(nombreArchivo, "usuarios");
      return res.status(400).json({
        ok: false,
        err: {
          message: "El usuario no existe",
        },
      });
    }

    borrarArchivo(usuarioBD.img, "usuarios");

    usuarioBD.img = nombreArchivo;
    usuarioBD.save((err, usuarioUpdate) => {
      res.json({
        ok: true,
        usuario: usuarioUpdate,
        img: nombreArchivo,
      });
    });
  });
}

function borrarArchivo(nombreImagen, tipo) {
  //Eliminar la imagen si es que ya existe una
  //Crear el path absoluto de la imagen
  let pathImagen = path.resolve(
    __dirname,
    `../../uploads/${tipo}/${nombreImagen}`
  );
  //fs.exisSync() devuelve true si existe
  if (fs.existsSync(pathImagen)) {
    fs.unlinkSync(pathImagen); //borra la imagen
  }
}

module.exports = app;
