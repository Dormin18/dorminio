
const express = require('express');
const bodyParser = require('body-parser');
var thingsloader = require('./model/thingsloader');
const mqtt = require('mqtt');
const settings = require('./settings');
var TeleSensor = require('./model/TeleSensor');
var things = thingsloader.things;

const urlencodedParser = bodyParser.urlencoded({extended: false});
const app = express();
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

var subscriberTopics = [];
for(var i = 0; i < things.length; i++) {
    if(things[i].topics.tpcTeleSensor) subscriberTopics.push({topic: things[i].topics.tpcTeleSensor, thingId: things[i].id});
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
    for(var i = 0; i < subscriberTopics.length; i++) {
        if(subscriberTopics[i].topic == topic) thingId = subscriberTopics.thingId;
    }
    if(thingId >= 0) {
        var ts = new TeleSensor(topic, message);
        things[thingId].saveTeleSensor(ts);    
    }
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
    res.json([1,2,3,4,5]);
});

app.post('/stateChange', urlencodedParser, function(req, res) {
    var id = req.body.id;
    var state = req.body.state;
    var index = 0;
    for(var i = 0; i < things.length; i++) {
        if(things[i].id == id) index=i;
    }
    things[index].state = state;
    res.json(things[index]);
});

app.get('/allThings', function(req, res) {
    res.json(things);
});

app.listen(4444, function() {
  console.log('Listening on port 4444 ...');
  console.log(things.length);
});