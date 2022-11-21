import { expect,assert } from "chai";
// import { Arguments } from "../Models/Arguments";
import "mocha";
import { Communication, Message, MessageI } from "../Models/Communication";

describe("Communication Tests", () => {
  it("Should Instantiate a Connection Listening", () => {
    try {
      var message: MessageI = new Message(
        { id: "AA", timeStamp: 0, ip: "localhost", port: 8080 },
        "hello",
        "teste"
      );
      const com = new Communication(8080, [8080]);
      com.on("listening", () => com.broadcast(message));
    } catch (e) {
      expect.fail();
    }
  });
  it("Should Send and Receive a Hello Message", (done) => {
    try {
      var message: MessageI = new Message(
        { id: "AA", timeStamp: 0, ip: "localhost", port: 8080 },
        "hello",
        "teste"
      );
      const com1 = new Communication(8080, [8080]);
      
      com1.on("listening", () => com1.broadcast(message));

      com1.on("message", (m) => {
        expect(m.sender.id).equal("AA");
        expect(m.sender.ip).equal("localhost");
        expect(m.sender.timeStamp).equal(0);
        expect(m.payload).equal("teste");
        expect(m.topic).equal("hello");
        done();
      });
    } catch (e) {
      expect.fail();
    }
  });
  it("Should Send and Receive a Hello Message between two Processes", (done) => {
    try {
      var message: MessageI = new Message(
        { id: "AA", timeStamp: 0, ip: "localhost", port: 8081 },
        "hello",
        "teste"
      );
      const com1 = new Communication(8080, [8081]);
      const com2 = new Communication(8081, [8080]);
      
      com1.on("listening", () => com1.broadcast(message));
      com2.on("message", (m) => {
        expect(m.sender.id).equal("AA");
        expect(m.sender.ip).equal("localhost");
        expect(m.sender.timeStamp).equal(0);
        expect(m.payload).equal("teste");
        expect(m.topic).equal("hello");
        done();
      });
    } catch (e) {
        assert.fail();
    }
  });
});
