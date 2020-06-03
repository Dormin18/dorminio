module.exports = function TeleState(topic, msg) {
    try {
        this.topic = topic.toString();
        this.message = msg.toString();
        this.msgObject = JSON.parse(msg.toString().trim());
        if(this.msgObject.POWER) this.state = this.msgObject.POWER;
        if(this.msgObject.POWER1) this.state = this.msgObject.POWER1;
    } catch(err) {
        console.log(err + '\n topic: ' + topic.toString() + '\n msg: ' + msg.toString());
    }
}
