const express = require('express');

const app = express();

const bodyParser = require('body-parser');


app.set('port', process.env.PORT || 4000);

app.listen(app.get('port'), () => {
    console.log('Server en el puerto '+ app.get('port'));
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
    next();
});
app.use('/links',require('./routes/links'));

app.use(require('./routes'));

//killall node
