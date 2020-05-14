function TeleState(topic, msg) {
  this.topic = topic.toString();
  this.message = msg.toString();
  this.state = -1;
}
exports.TeleState = TeleState;
