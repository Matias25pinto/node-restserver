const express = require("express"); // para poder crear un objeto express

let {
  verificaToken,
  verificaAdmin_Role,
} = require("../Middlewares/autenticacion"); // Verificar el token

let app = express(); // para utilizar express y realizar peticiones http

let Categoria = require("../models/categoria"); // Para utilizar el modelo de Categoria

//Mostrar todas las categorias
app.get("/categoria", verificaToken, (req, res) => {
  Categoria.find({})
    .sort("descripcion")
    .populate("usuario", "nombre email")
    .exec((err, categorias) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }
      res.status(200).json({
        ok: true,
        categorias: categorias,
      });
    });
});

//Mostrar una categoria por ID
app.get("/categoria/:id", verificaToken, (req, res) => {
  //Para buscar las categorías por ID existe la función en Moongose findById()
  //Categoria.findById(...)
  let id = req.params.id;
  Categoria.findById(id, (err, categoriaBD) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    if (!categoriaBD) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "El id no es correcto",
        },
      });
    }
    res.json({
      ok: true,
      categoria: categoriaBD,
    });
  });
});

//Crear Nueva categoria
app.post("/categoria", verificaToken, (req, res) => {
  //Rregresa la nueva categoria
  //req.usuario._id
  let body = req.body;

  let categoria = new Categoria({
    descripcion: body.descripcion,
    usuario: req.usuario._id,
  });
  //con .save() se guarda la categoría en la BD
  categoria.save((err, categoriaBD) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    if (!categoriaBD) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }
    res.json({
      ok: true,
      categoria: categoriaBD,
    });
  });
});
//Actualizar la categoria
app.put("/categoria/:id", (req, res) => {
  let id = req.params.id;
  let body = req.body;
  let descCategoria = {
    descripcion: body.descripcion,
  };
  Categoria.findByIdAndUpdate(
    id,
    descCategoria,
    { new: true },
    (err, categoriaBD) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }
      if (!categoriaBD) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }
      res.json({
        ok: true,
        categoria: categoriaBD,
      });
    }
  );
});

//Borrado de categoria
app.delete(
  "/categoria/:id",
  [verificaToken, verificaAdmin_Role],
  (req, res) => {
    //Solo un administrador puede borrar la categoría
    //Categoria.findByIdAndRemove() //Para eliminar una categoría de la BD
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaBD) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }
      if (!categoriaBD) {
        return res.status(400).json({
          ok: false,
          err: {
            message: "El id no existe",
          },
        });
      }
      res.status(200).json({
        ok: true,
        categoriaBD,
      });
    });
  }
);

module.exports = app; // para poder exportar el objeto app y todas sus funciones
