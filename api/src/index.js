const express = require('express');

const app = express();

const bodyParser = require('body-parser');

/**
 * Puerto donde funciona la rest api
 */
app.set('port', process.env.PORT || 4000);

/**
 * Escucha del puerto
 */
app.listen(app.get('port'), () => {
    console.log('Server en el puerto '+ app.get('port'));
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
    next();
});

/**
 * Se usa el links.js para usar los metodos post y get de la base de datos
 */
app.use('/links',require('./routes/links'));
app.use(require('./routes/links.js'));

//killall node
