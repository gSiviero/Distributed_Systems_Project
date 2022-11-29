
import { expect } from "chai";
import "mocha";
import { Site, SiteI } from "../Models/Site";
import { MessageFactory, MessageI } from "../Models/Message";
import { SelfSite, SelfSiteI } from "../Models/SelfSite";

describe("Message Tests", () => {
    it("Should Instantiate a HeartBeat Message", () => {
        const sender = new SelfSite("192.168.0.10",8080,1);
        const message:MessageI = MessageFactory.HeartBeatMessage(sender);
        expect(message.topic).equal("heartBeat");
        // expect(message.payload).equal(JSON.stringify([sender.toJson()]));
        expect(message.sender.id).equal(1);
        expect(message.sender.ip).equal("192.168.0.10");
        expect(message.sender.port).equal(8080);
      });
      
  });