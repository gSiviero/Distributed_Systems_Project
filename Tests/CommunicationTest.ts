import { expect, assert } from "chai";
// import { Arguments } from "../Models/Arguments";
import * as mocha from "mocha";
import { Communication } from "../Models/Communication";
import { MessageI } from "../Models/Message";

var message: MessageI = {
  sender: { id: 1, timeStamp: 0, ip: "localhost", port: 8080,leader:false },
  topic: "heartBeat",
  payload: "payload",
  hash: "hash",
  gossip:false,
};
describe("Communication Tests", () => {
  it("Should Instantiate a Connection Listening", (done) => {
    try {
      const com = new Communication(8080, [8080]);
      com.on("listening", () => done());
    } catch (e) {
      expect.fail();
    }
  });
  it("Should Send and Receive a Heart Beat Message", (done) => {
    try {
      const com1 = new Communication(8080, [8080]);
      com1.on("heartBeat", (m) => {
        expect(m.sender.id).equal(1);
        expect(m.sender.ip).equal("localhost");
        expect(m.sender.timeStamp).equal(0);
        expect(m.payload).equal("payload");
        expect(m.topic).equal("heartBeat");
        done();
      });
      com1.on("listening", () =>  com1.broadcast(message));

    } catch (e) {
      expect.fail();
    }
  }).timeout(3000);
  it("Should Send and Receive a Heart Beat Message between two Processes", (done) => {
    try {
      const com1 = new Communication(8080, [8081]);
      const com2 = new Communication(8081, [8080]);

      com1.on("listening", () => com1.broadcast(message));
      com2.on("heartBeat", (m) => {
        expect(m.sender.id).equal(1);
        expect(m.sender.ip).equal("localhost");
        expect(m.sender.timeStamp).equal(0);
        expect(m.payload).equal("payload");
        expect(m.topic).equal("heartBeat");
        done();
      });
    } catch (e) {
      assert.fail();
    }
  });
});
