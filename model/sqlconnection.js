const mysql = require('mysql');
const settings = require('../settings');

const sqlConnection = mysql.createConnection({
    host     : settings.SQLHost,
    port     : settings.SQLPort,
    user     : settings.SQLUser,
    password : settings.SQLUserPassword,
    database : settings.SQLDatabase
});

sqlConnection.connect((err) => {
    if(err) {
        console.log(err);
    } else {
        console.log('MariaDB connected ...');
    }
});

exports.sqlConnection = sqlConnection;
