require('./config/config'); // leer el archivo confi, y ejecutarlo, para poder usar las variables globales

const express = require('express');
const app = express();
const bodyParser = require('body-parser'); // Es un paquete que nos permite leer lo enviado en el body 

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false })); // es un middleware

// parse application/json
app.use(bodyParser.json()); // es un middleware

app.get('/usuario', function(req, res) {
    res.json('Get Usuario');
});

app.post('/usuario', function(req, res) {

    let body = req.body; // OBTIENE la informacion que viene en el BODY, FUNCIONA PARA POST, PUT, Y DELETE

    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es necesario'
        });
    } else {
        // mostrar lo que recibimos por el body
        res.json({
            body
        });
    }

});

app.put('/usuario/:id', function(req, res) {

    let id = req.params.id; // para obtener el parametro

    res.json({
        id
    });
});

app.delete('/usuario', function(req, res) {
    res.json('Delete Usuario');
})

app.listen(process.env.PORT, () => {
    console.log(`Escuchando puerto: ${process.env.PORT}`);
})