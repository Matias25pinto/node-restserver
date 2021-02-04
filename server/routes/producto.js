const express = require("express");

const _ = require("underscore"); //se utiliza para filtrar peticiones del body

const { verificaToken } = require("../Middlewares/autenticacion");

let app = express();
let Producto = require("../models/producto");
//Buscar productos, BUSCADOR
app.get("/productos/buscar/:termino", verificaToken, (req, res) => {
  let termino = req.params.termino; // obtenemos el termino de busqueda
  //Para realizar la busqueda vamos a utilizar expresiones regulares para que busque aproximados y no solo exactos
  let regex = new RegExp(termino, "i"); //la i, indica que no importa mayusculas y minusculas, es un objeto de Javascript por eso no importamos nada
  Producto.find({ nombre: regex })
    .populate("categoria", "descripcion")
    .exec((err, productos) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }
      res.status(200).json({
        ok: true,
        productos,
      });
    });
});
//Obtener todos los productos
app.get("/productos", verificaToken, (req, res) => {
  //traer todos los productos
  //populate: usuario categoria
  //pagina
  let condicion = {
    disponible: true,
  };
  Producto.find(condicion, (err, productosBD) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    Producto.countDocuments(condicion, (err, cantidad) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }
      res.status(200).json({
        ok: true,
        productos: productosBD,
        Total: cantidad,
      });
    });
  });
});
//Obtener producto por id
app.get("/producto/:id", verificaToken, (req, res) => {
  //populate: usuario categoria
  let id = req.params.id;
  Producto.findById(id, (err, producto) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    if (!producto) {
      return res.status(500).json({
        ok: false,
        err: {
          message: "El id del producto no existe",
        },
      });
    }
    res.status(200).json({
      ok: true,
      producto,
    });
  });
});
//Crear un nuevo producto
app.post("/producto", verificaToken, (req, res) => {
  //grabar el usuario
  //grabar una categoria del listado
  let body = req.body;
  let usuario = req.usuario;
  let producto = new Producto({
    nombre: body.nombre,
    precioUni: body.precioUni,
    descripcion: body.descripcion,
    categoria: body.categoria,
    usuario: usuario._id,
  });
  producto.save((err, producto) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    res.status(200).json({
      ok: true,
      message: "El producto fue creado con exito",
      producto,
    });
  });
});
//Actualizar un producto
app.put("/producto/:id", verificaToken, (req, res) => {
  //grabar el usuario
  //grabar una categoria del listado
  let id = req.params.id;
  //utilizamos _.pick para filtrar el contenido del body
  let body = _.pick(req.body, [
    "nombre",
    "precioUni",
    "descripcion",
    "categoria",
  ]);
  Producto.findByIdAndUpdate(id, body, { new: true }, (err, productoBD) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    if (!productoBD) {
      return res.status(500).json({
        ok: false,
        err: {
          message: "El id de producto no existe",
        },
      });
    }
    res.status(200).json({
      ok: true,
      productoBD,
    });
  });
});
//Borrar un producto
app.delete("/producto/:id", verificaToken, (req, res) => {
  //cambiar el estado del producto
  let id = req.params.id;

  Producto.findByIdAndUpdate(
    id,
    { disponible: false },
    { new: true },
    (err, productoBD) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }
      if (!productoBD) {
        return res.status(500).json({
          ok: false,
          err: {
            message: "El id no existe",
          },
        });
      }
      res.status(200).json({
        ok: true,
        message: "Producto Eliminado",
        productoBD,
      });
    }
  );
});

module.exports = app;
