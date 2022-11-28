import { expect } from "chai";
import "mocha";
import { SelfSite } from "../Models/SelfSite";

var testOrder = 0;
describe("Elections Tests", () => {
    
    it("Should Start Election", (done) => {
      const site = new SelfSite("localhost", 8080,1);
      const site2 = new SelfSite("localhost", 8081,2);
      setTimeout(() => {
        if(site.electionRunning)
            done();
      },1000)
    });

    it("Should Receive Election Message", (done) => {
        const site = new SelfSite("localhost", 8080,1);
        const site2 = new SelfSite("localhost", 8081,2);
        site2.communication.on("election",() => done());
      }).timeout(5000);

    it("Should NOT Receive Election Message", (done) => {
        const site = new SelfSite("localhost", 8080,1);
        const site2 = new SelfSite("localhost", 8081,2);
        site.communication.on("election",() => expect.fail());
        setTimeout(() => done(),3000);
      }).timeout(4000);

      it("Should Receive Coordinator Message", (done) => {
        const site = new SelfSite("localhost", 8080,1);
        const site2 = new SelfSite("localhost", 8081,2);
        site.communication.on("coordinator",() => done());
      }).timeout(5000);

      it("Should NOT Receive Coordinator Message", (done) => {
        const site = new SelfSite("localhost", 8080,1);
        const site2 = new SelfSite("localhost", 8081,2);
        site2.communication.on("coordinator",(d) => {
            console.log(JSON.stringify(d));
            expect.fail();
        } );
        setTimeout(() => done(),4500);
      }).timeout(5000);

      it("Site 4 should be elected Coordinator", (done) => {
        const site = new SelfSite("localhost", 8080,1);
        const site2 = new SelfSite("localhost", 8081,2);
        const site3 = new SelfSite("localhost", 8082,3);
        const site4 = new SelfSite("localhost", 8083,4);

        setTimeout(() => {
            var leader1 = site.fingerTable.getLeader();
            var leader2 = site2.fingerTable.getLeader();
            var leader3 = site3.fingerTable.getLeader();
            var leader4 = site4.fingerTable.getLeader();
            expect(leader1.id).equal(4);
            expect(leader2.id).equal(4);
            expect(leader3.id).equal(4);
            expect(leader4.id).equal(4);
            done();
        },4500);
      }).timeout(5000);

      it("Site 3 should be elected Coordinator", (done) => {
        const site = new SelfSite("localhost", 8080,1);
        const site2 = new SelfSite("localhost", 8081,2);
        const site3 = new SelfSite("localhost", 8082,3);
        var site4:SelfSite;

        setTimeout(() => {
            site4 = new SelfSite("localhost", 8083,4);},3000);      

        setTimeout(() => {
            var leader1 = site.fingerTable.getLeader();
            var leader2 = site2.fingerTable.getLeader();
            var leader3 = site3.fingerTable.getLeader();
            var leader4 = site4.fingerTable.getLeader();
            expect(leader1.id).equal(3);
            expect(leader2.id).equal(3);
            expect(leader3.id).equal(3);
            expect(leader4.id).equal(3);
            done();
        },4500);
      }).timeout(5000);


      it("Site 3 should be elected after Site 4 fails", (done) => {
        const site = new SelfSite("localhost", 8080,1);
        const site2 = new SelfSite("localhost", 8081,2);
        const site3 = new SelfSite("localhost", 8082,3);
        var site4 = new SelfSite("localhost", 8083,4);
        setTimeout(() => site4 = null,2000);

        setTimeout(() => {
            expect(site.electionRunning).equal(true);
            expect(site2.electionRunning).equal(true);
            expect(site3.electionRunning).equal(true);
        },3100)
                 
        setTimeout(() => {
            var leader1 = site.fingerTable.getLeader();
            var leader2 = site2.fingerTable.getLeader();
            var leader3 = site3.fingerTable.getLeader();
            expect(leader1.id).equal(3);
            expect(leader2.id).equal(3);
            expect(leader3.id).equal(3);
            done();
        },5800);
      }).timeout(10000);      
  });