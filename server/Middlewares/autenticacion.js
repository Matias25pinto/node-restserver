const jwt = require("jsonwebtoken");

//===================================
// Verificar Token
//===================================

let verificaToken = (req, res, next) => {
  let token = req.get("token");
  // Con el verify verificamos si el token es valido
  jwt.verify(token, process.env.SEED, (err, decoded) => {
    if (err) {
      // 401 error de no autorizado
      return res.status(401).json({
        ok: false,
        err,
      });
    }
    req.usuario = decoded.usuario;
    next(); // si no ejecutamos el next jamas va ejecutarse el resto del codigo de donde fue llamado el token
  });
};

//===================================
// Verificar AdminRole
//===================================

let verificaAdmin_Role = (req, res, next) => {
  let usuario = req.usuario;

  if (usuario.role === "ADMIN_ROLE") {
    next();
  } else {
    res.json({
      ok: false,
      err: {
        message: "El usuario no es administrador",
      },
    });
  }
};

//===================================
// Verificar Token Img,
//el token se pasa por url
//===================================
let verificaTokenImg = (req, res, next) => {
  let token = req.query.token;
  jwt.verify(token, process.env.SEED, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err: {
          message: "Token no valido",
        },
      });
    }
    req.usuario = decoded.usuario;

    next();
  });
};
module.exports = {
  verificaToken,
  verificaAdmin_Role,
  verificaTokenImg,
};
