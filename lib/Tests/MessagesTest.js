"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
require("mocha");
var Site_1 = require("../Models/Site");
var Message_1 = require("../Models/Message");
var SelfSite_1 = require("../Models/SelfSite");
var validSite = { ip: "192.168.0.10", port: 8080, id: 1, timeStamp: 0, leader: false };
describe("Message Tests", function () {
    it("Should Instantiate a HeartBeat Message", function () {
        var sender = new SelfSite_1.SelfSite(validSite.ip, validSite.port);
        var site = new Site_1.Site(validSite.ip, validSite.port);
        var message = Message_1.MessageFactory.HeartBeatMessage(sender);
        (0, chai_1.expect)(message.topic).equal("heartBeat");
        (0, chai_1.expect)(message.payload).equal(JSON.stringify([site.toJson()]));
        (0, chai_1.expect)(message.sender.id).equal(sender.id);
        (0, chai_1.expect)(message.sender.ip).equal("192.168.0.10");
        (0, chai_1.expect)(message.sender.port).equal(8080);
    });
});
