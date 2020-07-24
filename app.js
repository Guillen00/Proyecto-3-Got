
'use strict';
var debug = require('debug');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

var express = require('express');
var app = express();



app.put('/db', function (req, res) {
})

app.post('/init', function (req, res) {
    //repoName =req.body.name;
    //Crea la repo si no existe

})

app.post('/commit', function (req, res) {
    //repoName = req.body.name;
    //mensaje =  req.body.message; Mensaje para el commit
    //files = req.body.files  (debe ser un array)
    //fileContent = req.body.fileContent  (debe ser un array)

    //version de commit para cada archivo = req.body.commitID  


    // chequear que la version de commit sea la misma en el server y en el cliente

    //Si la verison de commit en el cliente es diferente a la del servidor,  
    //se rechaza el commit
    //res.send({status:"rejected", reason : "Different Commit Version on Server" })

    //Si no hay problema:
    //Agrega los cambios a la tabla de historial de commits (SE GENERA EL COMMIT ID)
    //res.send({status: "success", commiIDs: commitID generado con md5}) (Ojo, el ultimo es un array)
    
})

app.get('/status', function (req, res) {
    //repoName = req.body.name;
    //file = req.body.file;

    // Si file == ""
        //retorna lo almacenado en el ultimo historial de cambios
    // Si file !=""
        //retorna el historial completo del archivo
})


app.put('/rollback', function (req, res) {
    //repoName = req.body.name;
    //file = req.body.file;
    //commitID = req.body.commitID;

    //Se devuelve a la version de commit solicitada
    //res.send({file: file, fileContent:fileContent});

})

app.get('/get', function (req, res) {
    //repoName = req.body.name;
    //file = req.body.file;

    //Se devuelve la ultima version
    //res.send({file: file, fileContent:fileContent, commitID: commitID});

})

app.set('port', process.env.PORT || 3000);
var server = app.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
});