"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageFactory = void 0;
var ts_md5_1 = require("ts-md5");
/**Implementation of Message */
var Message = /** @class */ (function () {
    /**
     *
     * @param sender Site who originated the Message
     * @param topic Topic that identifies the type of message
     * @param payload Actual Payload.
     */
    function Message(sender, topic, payload) {
        this.sender = sender;
        this.topic = topic;
        this.payload = payload;
        this.hash = ts_md5_1.Md5.hashStr(JSON.stringify(this));
    }
    return Message;
}());
var MessageFactory = /** @class */ (function () {
    function MessageFactory() {
    }
    MessageFactory.HeartBeatMessage = function (sender) {
        return new Message(sender.toJson(), "heartBeat", JSON.stringify(sender.fingerTable.getEntries()));
    };
    MessageFactory.FailureDetected = function (sender, failureId) {
        return new Message(sender.toJson(), "failure", failureId.toString());
    };
    MessageFactory.EllectionMessage = function (sender) {
        return new Message(sender.toJson(), "election", null);
    };
    MessageFactory.CoordinatorMessage = function (sender) {
        return new Message(sender.toJson(), "coordinator", null);
    };
    return MessageFactory;
}());
exports.MessageFactory = MessageFactory;
