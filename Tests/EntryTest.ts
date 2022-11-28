import { expect } from "chai";
import "mocha"
import { SelfSite } from "../Models/SelfSite";

describe("Site Test", () => {
  it("Instantiating a Site", () => {
    const site = new SelfSite("192.168.0.1", 8080,1);
    expect(site.id).equal(1);
    expect(site.port).equal(8080);
    expect(site.ip).equal("192.168.0.1");
    expect(site.fingerTable.getEntries()[0].id).equal(1);
  });

  it("Receiving HeartBeat", () => {
    const site = new SelfSite("192.168.0.1", 8080,1);
    const site2 = new SelfSite("192.168.0.2", 8080,2);
    setTimeout(() =>{
        var entries = site.fingerTable.getEntries();
        expect(entries.length).equal(2);
        expect(entries[0].id).equal(1);
        expect(entries[1].id).equal(2);
    },1000);
  });

  it("Receiving Failure Message", (done) => {
    const site = new SelfSite("192.168.0.1", 8080,1);
    var site2 = new SelfSite("192.168.0.2", 8080,2);

    setTimeout(() =>{
        var entries = site.fingerTable.getEntries();
        expect(entries.length).equal(2);
        site2 = null;
    },1500);
    setTimeout(() => {
        var entries = site.fingerTable.getEntries();
        expect(entries.length).equal(1);
        done();
    })
  }).timeout(3000);

  it("Finger Table Testing", (done) => {
    const site = new SelfSite("192.168.0.1", 8080,1);
    var site2 = new SelfSite("192.168.0.2", 8080,2);
    var site3 = new SelfSite("192.168.0.3", 8080,3);
    var site4 = new SelfSite("192.168.0.4", 8080,4);

    setTimeout(() =>{
        var entriesId = site.fingerTable.getEntries().map((e) => e.id);
        expect(entriesId).contains(1);
        expect(entriesId).contains(2);
        expect(entriesId).contains(3);
        expect(entriesId).contains(4);
        expect(entriesId).not.contains(185);
        done();
    },1500);

  }).timeout(3000);
});
