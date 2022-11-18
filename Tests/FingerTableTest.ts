import { Site, SelfSite, SiteI } from "../Models/Site";
import { expect } from "chai";
import "mocha";
import { FingerTable,FingerTableSite} from "../Models/FingerTable";

const validIp1: string = "192.168.0.2"
const validPort1: number = 8080;

const validIp2: string = "192.168.0.3"
const validPort2: number = 8080;


describe("Finger Table Test", () => {
    it("Should Instantiate FingerTable Element Correctly", () => {
      const site = new Site(validIp1, validPort1);
      const fingerTableSite = new FingerTableSite(site);
      expect(fingerTableSite.clock.getTime()).closeTo(new Date().getTime(),100);
    });

    it("Should not Instantiate FingerTable Element Correctly", () => {
        const site = {"ip":null,"id":null,"port":null,"timeStamp":0};
        try{
            const fingerTableSite = new FingerTableSite(site);
            expect.fail();
        }
        catch(e){
         expect(e.length).to.equal(3);   
        }
      });
  
    it("Should Instantiate FingerTable Correctly", () => {
      const fingerTable = new FingerTable(1);
      const site = new Site(validIp1, validPort1);
      const site2 = new Site(validIp2, validPort2);
      const fingerTableSite = new FingerTableSite(site);
      const fingerTableSite2 = new FingerTableSite(site2);
      fingerTable.upsertEntry(fingerTableSite);
      fingerTable.upsertEntry(fingerTableSite2);
      expect(fingerTable.getEntries().length).to.equal(2);
    });

    it("Should Update FingerTable Correctly", () => {
        const fingerTable = new FingerTable(1);
        const site = new Site(validIp1, validPort1);
        const site2 = new Site(validIp2, validPort2);
        const site2_1 = new Site(validIp2, validPort2);
        site2_1.timeStamp = 1;
        const fingerTableSite = new FingerTableSite(site);
        const fingerTableSite2 = new FingerTableSite(site2);
        const fingerTableSite3 = new FingerTableSite(site2_1);
        fingerTable.upsertEntry(fingerTableSite);
        fingerTable.upsertEntry(fingerTableSite2);
        fingerTable.upsertEntry(fingerTableSite3);
        expect(fingerTable.getEntries().length).to.equal(2);
      });

      it("Should Detect No Failure", () => {
        const fingerTable = new FingerTable(1);
        const site = new Site(validIp1, validPort1);
        const site2 = new Site(validIp2, validPort2);
        const fingerTableSite = new FingerTableSite(site);
        const fingerTableSite2 = new FingerTableSite(site2);
        fingerTable.upsertEntry(fingerTableSite);
        fingerTable.upsertEntry(fingerTableSite2);
        fingerTable.on("failure",(data) => {
            expect.fail();
        })
        setInterval(() => {},700)
      });

      it("Should Detect Failure", () => {
        const fingerTable = new FingerTable(1);
        const site = new Site(validIp1, validPort1);
        const site2 = new Site(validIp2, validPort2);
        const fingerTableSite = new FingerTableSite(site);
        const fingerTableSite2 = new FingerTableSite(site2);
        fingerTable.upsertEntry(fingerTableSite);
        fingerTable.upsertEntry(fingerTableSite2);
        fingerTable.on("failure",(data) => {
            expect(data.length).to.equal(2);
        })
        setInterval(() => {},2000);
      });
  });