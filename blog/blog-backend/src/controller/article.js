const fs = require('fs');
const path = require('path');

const curso = (req, res) => {
    console.log('Se ha ejecutado el endpoint probando');

    return res.status(200).json([
        {
            curso: 'Master en React',
            autor: 'Víctor Robles WEB',
            url: 'victorroblesweb.es/master-react',
        },
        {
            curso: 'Master en React',
            autor: 'Víctor Robles WEB',
            url: 'victorroblesweb.es/master-react',
        },
    ]);
};

const prueba = (req, res) => {
    return res.status(200).json({
        mensaje: 'Soy una acción de prueba en mi controlador de artículos',
    });
};

module.exports = {
    curso,
    prueba,
};
