const mysql = require('mysql');

const {promisify} = require('util');

const {database} = require('./keys');

const pool = mysql.createPool(database);

//Conexion con la base de datos
pool.getConnection((err, connection) => {
    if(err) {
        if(err.code === 'PROTOCOL_CONNECTION_LOST'){
            console.error('Se perdió conexion con la base de datos');
        }
        if(err.code === 'ER_CON_COUNT_ERROR'){
            console.error('La base de datos tiene muchas conexiones');

        }if(err.code === 'ECONNREFUSED'){
            console.error('Conexion a base de datos rechazada');

        }

    }
    if(connection){

     connection.release();
    console.log('Conexion a base de datos exitosa');
    }
    return;
});

//Pool querys

pool.query = promisify(pool.query);

module.exports = pool;
