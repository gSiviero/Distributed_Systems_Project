"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var Communication_1 = require("../Models/Communication");
var message = {
    sender: { id: 1, timeStamp: 0, ip: "localhost", port: 8080, leader: false },
    topic: "heartBeat",
    payload: "payload",
    hash: "hash",
};
describe("Communication Tests", function () {
    it("Should Instantiate a Connection Listening", function (done) {
        try {
            var com = new Communication_1.Communication(8080, [8080]);
            com.on("listening", function () { return done(); });
        }
        catch (e) {
            chai_1.expect.fail();
        }
    });
    it("Should Send and Receive a Heart Beat Message", function (done) {
        try {
            var com1_1 = new Communication_1.Communication(8080, [8080]);
            com1_1.on("heartBeat", function (m) {
                (0, chai_1.expect)(m.sender.id).equal(1);
                (0, chai_1.expect)(m.sender.ip).equal("localhost");
                (0, chai_1.expect)(m.sender.timeStamp).equal(0);
                (0, chai_1.expect)(m.payload).equal("payload");
                (0, chai_1.expect)(m.topic).equal("heartBeat");
                done();
            });
            com1_1.on("listening", function () { return com1_1.broadcast(message); });
        }
        catch (e) {
            chai_1.expect.fail();
        }
    }).timeout(3000);
    it("Should Send and Receive a Heart Beat Message between two Processes", function (done) {
        try {
            var com1_2 = new Communication_1.Communication(8080, [8081]);
            var com2 = new Communication_1.Communication(8081, [8080]);
            com1_2.on("listening", function () { return com1_2.broadcast(message); });
            com2.on("heartBeat", function (m) {
                (0, chai_1.expect)(m.sender.id).equal(1);
                (0, chai_1.expect)(m.sender.ip).equal("localhost");
                (0, chai_1.expect)(m.sender.timeStamp).equal(0);
                (0, chai_1.expect)(m.payload).equal("payload");
                (0, chai_1.expect)(m.topic).equal("heartBeat");
                done();
            });
        }
        catch (e) {
            chai_1.assert.fail();
        }
    });
});
