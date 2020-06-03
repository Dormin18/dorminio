
const express = require('express');
const bodyParser = require('body-parser');
var thingsloader = require('./model/thingsloader');
const mqtt = require('mqtt');
const settings = require('./settings');
var TeleSensor = require('./model/TeleSensor');
var TeleState = require('./model/TeleState');
var StatPower = require('./model/StatPower');
var things = thingsloader.things;

const urlencodedParser = bodyParser.urlencoded({extended: false});
const app = express();
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

var subscriberTopics = [];
for(var i = 0; i < things.length; i++) {
    if(things[i].topics.tpcTeleSensor) 
        subscriberTopics.push({topic: things[i].topics.tpcTeleSensor, thingId: things[i].id, index: i, type: 'TeleSensor'});
    if(things[i].topics.tpcTeleState) 
        subscriberTopics.push({topic: things[i].topics.tpcTeleState, thingId: things[i].id, index: i, type: 'TeleState'});
    if(things[i].topics.tpcStatPower1) 
        subscriberTopics.push({topic: things[i].topics.tpcStatPower1, thingId: things[i].id, index: i, type: 'StatPower'});
}

var client = mqtt.connect(settings.MQTTHost);
client.on('connect', () => {
    for(var i = 0; i < subscriberTopics.length; i++) {
        client.subscribe(subscriberTopics[i].topic);
        console.log('Subscriber: ' + subscriberTopics[i].topic);
    }
});

client.on('message', (topic, message) => {
    var thingId = -1;
    var index = -1;
    var tpcType = '';
    for(var i = 0; i < subscriberTopics.length; i++) {
        if(subscriberTopics[i].topic.toUpperCase() == topic.toUpperCase()) {
            thingId = subscriberTopics[i].thingId;  
            index = subscriberTopics[i].index;
            tpcType = subscriberTopics[i].type;
        } 
    }
    if(thingId >= 0) {
        if(tpcType == 'TeleSensor') {
            var ts = new TeleSensor(topic, message);
            things[index].saveTeleSensor(ts);      
        }
        if(tpcType == 'TeleState') {
            var ts = new TeleState(topic, message);
            things[index].saveTeleState(ts);   
            // console.log('State: ' + things[index].tileData.state);
        }    
        if(tpcType == 'StatPower') {
            var sp = new StatPower(topic, message);
            things[index].saveTeleState(sp);   
            console.log('State: ' + things[index].tileData.state);
        }
    }
    // console.log(subscriberTopics[0].topic + ' | ' + subscriberTopics[1].topic + ' | ' + topic);
    // console.log('Current Power 0: ' + things[0].currentData.power);
    // console.log('Current Power 1: ' + things[1].currentData.power);
});

app.post('/things', urlencodedParser, function(req, res) {
    var id = req.body.id;
    var index = 0;
    for(var i = 0; i < things.length; i++) {
        if(things[i].id == id) index=i;
    }
    res.json(things[index].tileData);
});

app.post('/updates', urlencodedParser, function(req, res) {
    res.json([1,2,3,4,5,6,7,8,9,10]);
});

app.post('/stateChange', urlencodedParser, function(req, res) {
    var id = req.body.id;
    var state = req.body.state;
    var index = 0;
    for(var i = 0; i < things.length; i++) {
        if(things[i].id == id) index=i;
    }
    things[index].state = state;
    client.publish(things[index].topics.tpcCommandPower1,state);
    res.json(things[index].tileData);
});

app.get('/allThings', function(req, res) {
    var all = [];
    for(var i = 0; i < things.length; i++) {
        all.push(things[i].tileData);
    }
    res.json(all);
});

app.post('/chartData', urlencodedParser, function(req, res) {
    var retVal = {chartData: [20,22,21,32,26,31,44,8,7,5,9,8,8,7,6,32,26,31,4]};
    res.json(retVal);
});

app.listen(4444, function() {
  console.log('Listening on port 4444 ...');
  console.log(things.length);
});

app.on('error', (err) =>
    console.log(err.stack)
)