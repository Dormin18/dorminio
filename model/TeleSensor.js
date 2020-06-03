const mysql = require('mysql');
const settings = require('../settings');

var sqlConnection = mysql.createConnection({
    host     : settings.SQLHost,
    port     : settings.SQLPort,
    user     : settings.SQLUser,
    password : settings.SQLUserPassword,
    database : settings.SQLDatabase
});

module.exports = function TeleSensor(topic, msg) {
    this.topicArray = topic.toString().split('/');
    this.msgObject = JSON.parse(msg.toString());
    this.item = this.topicArray[this.topicArray.length - 3];
    this.timeStamp = this.msgObject.Time.toString();
    this.curPower = this.msgObject.ENERGY.Power.toString();
    this.totPower = this.msgObject.ENERGY.Total.toString();
    this.prevDay = this.msgObject.ENERGY.Yesterday.toString();
    this.state = '-1';
    this.consumerPowerLevel = -2;
    this.topic = topic.toString();
    this.message = msg.toString();
    this.event = '';
    this.sqlinsertPowData = function () {
        sqlConnection.connect((err) => {
            if(err) {
                console.log(err);
            } else {
                console.log('MariaDB connected ...');
                var sqlDate = this.timeStamp.slice(0, 19).replace('T', ' '); // 2020-04-19 23:17:29
                var sql = "INSERT INTO SonoffPowData";
                sql += "(SPD_Item, SPD_TimeStamp, SPD_CurPow, SPD_TotPow, SPD_PrevDay, SPD_State, SPD_Topic, SPD_Msg)";
                sql += " VALUES('" + this.item + "', '" + sqlDate + "', " + this.curPower;
                sql += "," + this.totPower + ", " + this.prevDay + ", " + this.state;
                sql += ",'" + this.topic + "', '" + this.message + "')";
                sqlConnection.query(sql, function (error, results, fields) {
                    if (error)
                        throw error;
                });
                if (this.event) {
                    sql = "INSERT INTO Events(E_Item, E_Time, E_Event) ";
                    sql += " VALUES('" + this.item + "','" + sqlDate + "','" + this.event + "')";
                    sqlConnection.query(sql, function (error, results, fields) {
                        if (error)
                            throw error;
                    });
                }
            }
        });
        sqlConnection.end();
    };
}

