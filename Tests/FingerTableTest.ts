import { Site} from "../Models/Site";
import { expect } from "chai";
import "mocha";
import { FingerTable,FingerTableSite} from "../Models/FingerTable";

const fingerTable = new FingerTable(1);
const site = new Site("192.168.0.2", 8080,1);
const site2 = new Site("192.168.0.3", 8080,2);
const fingerTableSite = new FingerTableSite(site);
const fingerTableSite2 = new FingerTableSite(site2);
fingerTable.upsertEntry(fingerTableSite2);
fingerTable.upsertEntry(fingerTableSite);

const fingerTable2 = new FingerTable(1);
const site2_1 = new Site("192.168.0.3", 8080,2);
site2_1.timeStamp = 1;
const fingerTableSite3 = new FingerTableSite(site2_1);
fingerTable2.upsertEntry(fingerTableSite);
fingerTable2.upsertEntry(fingerTableSite2);
fingerTable2.upsertEntry(fingerTableSite3);


const fingerTable3 = new FingerTable(1);
const leader = new Site("192.168.0.4", 8080,3);
leader.leader = true;
const fingerTableLeader = new FingerTableSite(leader);
fingerTable3.upsertEntry(fingerTableSite);
fingerTable3.upsertEntry(fingerTableLeader);

describe("Finger Table Test", () => {
    it("Should Instantiate FingerTable Element Correctly", () => {
      const site = new Site("192.168.0.2", 8080,1);
      const fingerTableSite = new FingerTableSite(site);
      expect(fingerTableSite.clock.getTime()).closeTo(new Date().getTime(),100);
    });

    it("Should not Instantiate FingerTable Element Correctly", () => {
        const site = {"ip":null,"id":null,"port":null,"timeStamp":0,leader:false,client:false,lastHeartBeat:new Date()};
        try{
            const fingerTableSite = new FingerTableSite(site);
            expect.fail();
        }
        catch(e){
         expect(e.length).to.equal(2);   
        }
      });
  
    it("Entries Should be in Order", () =>  {
      var entries = fingerTable.getEntries();
      expect(entries.length).to.equal(2);
      expect(entries[0].id).equal(1);
      expect(entries[1].id).equal(2);
      fingerTable.removeEntryById(2);
      fingerTable.upsertEntry(leader);
      entries = fingerTable.getEntries();
      expect(entries[1].id).equal(3);
    });

    it("Should Update FingerTable Correctly", () =>  expect(fingerTable2.getEntries().length).to.equal(2));

      it("Should Detect No Failure", (done) => {
        fingerTable.on("failure",(data) => {
            expect.fail();
        })
        setInterval(() => done(),700)
      });

      it("Should Detect Failure", (done) => {
        fingerTable.on("failure",(data) => {
            done();
        })
      }).timeout(3000);

      it("Should Return All Nodes with smaller ID", () => {
        var entries = fingerTable.getEntriesWithSmallerId(1);
        expect(entries.length).equal(0);
        var entries = fingerTable.getEntriesWithSmallerId(2);
        expect(entries.length).equal(1);
        expect(entries[0].id).equal(1);
        var entries = fingerTable.getEntriesWithSmallerId(3);
        expect(entries.length).equal(2);
        expect(entries[0].id).equal(1);
        expect(entries[1].id).equal(2);
      });
      
      it("Should Return All Nodes with greater ID", () => {
        var entries = fingerTable.getEntriesWithGreaterId(2);
        expect(entries.length).equal(0);
        var entries = fingerTable.getEntriesWithGreaterId(1);
        expect(entries.length).equal(1);
        var entries = fingerTable.getEntriesWithGreaterId(0);
        expect(entries.length).equal(2);
      });

      it("Should Return no Leader", () => {
        var leader = fingerTable.getLeader();
        expect(leader).equal(null);
      });

      
      it("Should return Leader", () => {
        var leader = fingerTable3.getLeader();
        console.log(fingerTable3.getEntries());
        expect(leader).not.null;
      });
  });