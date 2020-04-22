const express = require('express');
const app = express();
const mysql = require('mysql');
const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://192.168.___.___');

const sqlConnection = mysql.createConnection({
    host     : '192.168.___.___',
    port     : '3307',
    user     : '___',
    password : '___',
    database : 'SmartHome'
});

sqlConnection.connect((err) => {
    if(err) {
        console.log(err);
    } else {
        console.log('MariaDB connected ...');
    }
});

var connected = false;
var db = new Database();

function PowerData(topic, msg) {
  this.topicArray = topic.toString().split('/');
  this.msgObject = JSON.parse(msg.toString());
  this.item = this.topicArray[this.topicArray.length-3];
  this.timeStamp = this.msgObject.Time.toString();
  this.curPower = this.msgObject.ENERGY.Power.toString();
  this.totPower = this.msgObject.ENERGY.Total.toString();
  this.prevDay = this.msgObject.ENERGY.Yesterday.toString();
  this.state = '-1';
  this.topic = topic.toString();
  this.message = msg.toString();
  this.event = '';
}

function sqlinsertPowData(pd1) {
  var sqlDate = pd1.timeStamp.slice(0, 19).replace('T', ' ');                     // 2020-04-19 23:17:29
  var sql = "INSERT INTO SonoffPowData";
  sql += "(SPD_Item, SPD_TimeStamp, SPD_CurPow, SPD_TotPow, SPD_PrevDay, SPD_State, SPD_Topic, SPD_Msg)";
  sql += " VALUES('" + pd1.item + "', '" + sqlDate + "', " + pd1.curPower;
  sql += "," + pd1.totPower + ", " + pd1.prevDay + ", " + pd1.state;
  sql += ",'" + pd1.topic + "', '" + pd1.message + "')";
  sqlConnection.query(sql, function(error, results, fields) {
    if (error) throw error;    
  })
  if(pd1.event) {
    sql = "INSERT INTO Events(E_Item, E_Time, E_Event) ";
    sql += " VALUES('" + pd1.item + "','" + sqlDate + "','" + pd1.event + "')";
    sqlConnection.query(sql, function(error, results, fields) {
      if (error) throw error;    
    })
  }

}

function Website() {
  this.config = [
  {
    channel: "Sonoff50",
    row: 0,
    column: 0
  },
  {
    channel: "Sonoff43",
    row: 0,
    column: 1
  }];
  this.create = function() {
    var createDB = db.reverse();
    var pd = new PowerData;
    var resStr = '<TABLE><TR>';
    for(var col=0; col<=1; col++) {
      for(var i=0; i<createDB.length; i++) {
        if(createDB[i].channel=this.config[col].channel) {
          pd=createDB[i];
          // HTML
          resStr += '<TD SPAN="3">' + pd.channel + '</TD>';
          resStr += '<TD>Leistung:</TD><TD>'+pd.curPower+'</TD><TD></TD>';
          resStr += '<TD>Status:</TD><TD>'+pd.state+'</TD><TD></TD>';
          resStr += '<TD>Total:</TD><TD>'+pd.totPower+'</TD><TD></TD>';
          resStr += '<TD>Total:</TD><TD>'+pd.totPower+'</TD><TD></TD>';
          resStr += '<TD SPAN="3">' + pd.timeStamp + '</TD></TR></TABLE>';
          break;
        }
      }
    }

  }
}

function Database() {
  this.data = [];
  this.dataLimit=10000;
  this.config = {
    Sonoff50: {
      limit: 10,
      counter: 6,
      title: 'Fernseher',
      prevState: -1
    }, 
    Sonoff43: {
      limit: 12,
      counter: 6,
      title: 'Maries Fernseher',
      prevState: -1
    },
    BW_SHP5_53: {
      limit: 12,
      counter: 4,
      title: 'Lampe Buero',
      prevState: -1
    },
    Sonoff52: {
      limit: 20,
      counter: 6,
      title: 'Trockner',
      prevState: -1
    },
    Teckin55: {
      limit: 15,
      counter: 5,
      title: 'Spuelmaschine',
      prevState: -1
    },
    Teckin58: {
      limit: 20,
      counter: 7,
      title: 'Waschmaschine',
      prevState: -1
    }
  }
  this.insert = function(pd) {
    this.data.push(pd);
    this.evaluateState(pd.item, 10);
  };
  this.select = function(prop, value) {
    if(!prop) {
      // kompletter Inhalt zurueck
      return this.data;
    }
    for(var resArr = [], i=0; i < this.data.length; i++) {
      if(this.data[i][prop] === val) {
        resArr.push(this.data[i]);
      }
    }
    return resArr;
  };
  this.update = function(selProp, selVal, updProp, updVal) {
    for(var resArr = [], i=0; i < this.data.length; i++) {
      if(this.data[i][selProp] === selVal) {
        this.data[i][updProp] = updVal;
      }
    }
    return resArr;    
  };
  this.delete = function(delProp, delVal) {
    if(!delProp) {
      var currentDatabase = this.data;
      this.data = [];
      return currentDatabase;
    }
    for(var resArr = [], i=0; i < this.data.length; i++) {
      if(this.data[i][selProp] === selVal) {
        this.data.splice(i,1);
      }
    }
    return resArr;      
  }
  this.archive = function(remaining) {
    while(this.data.length > remaining) {
      var pd = this.data.shift();
      sqlinsertPowData(pd);
    }
  }
  this.printFormatted = function(pdata) {  
    var resStr = fillString(pdata.item, ' ', 12) + ' | '
    + fillString(pdata.timeStamp, ' ', 22) + ' | '
    + fillString(pdata.curPower, ' ', 6) + ' | '
    + fillString(pdata.totPower, ' ', 9) + ' | '
    + fillString(pdata.state, ' ', 3) + ' | '
    + pdata.event;
    return resStr;
  }
  this.evaluateState = function(item, limit) {
    var counter = 0;
    var prevState = 0, curState = 0, newState = 0, oldState = 0;
    var eventText = '';
    for(var i = 0; i < this.data.length; i++) {
      if(this.data[i].item === item) {
        if(this.config[item]) {
          oldState = this.config[item].prevState;
          eventText = '';
          if(this.data[i].curPower < this.config[item].limit) {
            curState = 0;
            if(prevState == 0) counter++;
            if(prevState == 1) counter = 0;
            if(counter >= this.config[item].counter) {
              newState = 0;
            }
          }
          if(this.data[i].curPower >= this.config[item].limit) {
            curState = 1;
            if(prevState == 1) counter++;
            if(prevState == 0) counter = 0;
            if(counter >= this.config[item].counter) {
              newState = 1;
            }
          }
          if(this.data[i].state == "-1") {
            this.data[i].state = newState.toString();
            if(newState == 1 && oldState == 0) {
              eventText = this.data[i].item + ': ' + this.config[item].title + ' eingeschaltet';
              this.data[i].event = eventText;
              // console.log(eventText);
            }
            if(newState == 0 && oldState == 1) {
              eventText = this.data[i].item + ': ' + this.config[item].title + ' ausgeschaltet';
              this.data[i].event = eventText;
              // console.log(eventText);
            }
          } 
          if(i == this.data.length-1) {
            console.log('p: ' + prevState + '; c: ' + curState + '; o: ' + oldState + '; n: ' + newState + '; cnt: ' + counter + '; Evt: ' + eventText);
          }
          prevState = curState;     
          this.config[item].prevState = newState;     
        }
        else {
          this.data[i].state=-2;
        }
      }
    }
    return true;
  }
}

function fillString(str, chr, cnt)
{
  if(str.length < cnt) {
    str = str + chr;
    str = fillString(str, chr, cnt);
  }
  return str;
}

function nl2br (str, replaceMode) {
  var breakTag = '<br>';
  var replaceStr = (replaceMode) ? '$1'+ breakTag : '$1'+ breakTag +'$2';
  return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, replaceStr);
}

client.on('connect', () => {
  client.subscribe('Haus/#');
  console.log('Verbunden ... ');
})

client.on('message', (topic, message) => {
  // console.log(topic.toString())
  // console.log(message.toString()+'\n')
  var topicArray = topic.toString().split('/');
  var cmnd = topicArray[topicArray.length-1];
  // console.log(cmnd)
  if(cmnd=='SENSOR')
  {
    var pdata1 = new PowerData(topic, message);
    // pdata1.insertSQL();
    var msg = JSON.parse(message.toString());
    console.clear();
    db.insert(pdata1);
    db.archive(600);
    console.log('Länge: ' + db.data.length + ' | ' + db.printFormatted(db.data[db.data.length-1]))
    //console.log(db);
    // console.log(db.printFormatted(false, 'channel', 'Sonoff50'));
  }
})

app.get('/', (req, res) => res.send(db.printFormatted(true)))
app.listen(4081, () => console.log('Example app listening on port 4081!'))
