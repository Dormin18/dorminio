module.exports = function StatPower(topic, msg) {
    this.topic = topic.toString();
    this.message = msg.toString();
    //this.msgObject = JSON.parse(msg.toString());
    this.state = this.message;
}