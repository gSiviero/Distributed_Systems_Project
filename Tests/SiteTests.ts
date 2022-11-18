import { Site, SelfSite, SiteI } from "../Models/Site";
import { Md5 } from "ts-md5";
import { assert, expect } from "chai";
import "mocha";
import { FingerTable,FingerTableSite} from "../Models/FingerTable";

const validIp1: string = "192.168.0.2"
const validPort1: number = 8080;

const validIp2: string = "192.168.0.3"
const validPort2: number = 8080;

describe("Site test", () => {
  it("Should Instantiate Site Correctly", () => {
    const site = new Site(validIp1, validPort1);
    const id: string = Md5.hashStr(validIp1 + validPort1.toString()).slice(-2);
    expect(site.ip).to.equal(validIp1);
    expect(site.port).to.equal(validPort1);
    expect(site.id).to.equal(id);
    expect(site.timeStamp).to.equal(0);
  });
  it("Should Throw Error", () => {
    const ip: string = null;
    const port: number = null;
    try {
      const site = new Site(ip, port);
      expect.fail();
    } catch (e) {
      expect(e[0]).equal("ip cannot be null or undefined");
      expect(e[1]).equal("port cannot be null or undefined");
    }
  });
});
