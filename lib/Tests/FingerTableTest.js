"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Site_1 = require("../Models/Site");
var chai_1 = require("chai");
require("mocha");
var FingerTable_1 = require("../Models/FingerTable");
var validIp1 = "192.168.0.2";
var validPort1 = 8080;
var id1 = 1;
var validIp2 = "192.168.0.3";
var validPort2 = 8080;
var id2 = 2;
var fingerTable = new FingerTable_1.FingerTable(1);
var site = new Site_1.Site(validIp1, validPort1, id1);
var site2 = new Site_1.Site(validIp2, validPort2, id2);
var fingerTableSite = new FingerTable_1.FingerTableSite(site);
var fingerTableSite2 = new FingerTable_1.FingerTableSite(site2);
fingerTable.upsertEntry(fingerTableSite);
fingerTable.upsertEntry(fingerTableSite2);
var fingerTable2 = new FingerTable_1.FingerTable(1);
var site2_1 = new Site_1.Site(validIp2, validPort2, id2);
site2_1.timeStamp = 1;
var fingerTableSite3 = new FingerTable_1.FingerTableSite(site2_1);
fingerTable2.upsertEntry(fingerTableSite);
fingerTable2.upsertEntry(fingerTableSite2);
fingerTable2.upsertEntry(fingerTableSite3);
var fingerTable3 = new FingerTable_1.FingerTable(1);
var leader = new Site_1.Site(validIp2, validPort2);
leader.leader = true;
var fingerTableLeader = new FingerTable_1.FingerTableSite(leader);
fingerTable3.upsertEntry(fingerTableSite);
fingerTable3.upsertEntry(fingerTableLeader);
describe("Finger Table Test", function () {
    it("Should Instantiate FingerTable Element Correctly", function () {
        var site = new Site_1.Site(validIp1, validPort1);
        var fingerTableSite = new FingerTable_1.FingerTableSite(site);
        (0, chai_1.expect)(fingerTableSite.clock.getTime()).closeTo(new Date().getTime(), 100);
    });
    it("Should not Instantiate FingerTable Element Correctly", function () {
        var site = { "ip": null, "id": null, "port": null, "timeStamp": 0, leader: false };
        try {
            var fingerTableSite_1 = new FingerTable_1.FingerTableSite(site);
            chai_1.expect.fail();
        }
        catch (e) {
            (0, chai_1.expect)(e.length).to.equal(2);
        }
    });
    it("Should Instantiate FingerTable Correctly", function () { return (0, chai_1.expect)(fingerTable.getEntries().length).to.equal(2); });
    it("Should Update FingerTable Correctly", function () { return (0, chai_1.expect)(fingerTable2.getEntries().length).to.equal(2); });
    it("Should Detect No Failure", function (done) {
        fingerTable.on("failure", function (data) {
            chai_1.expect.fail();
        });
        setInterval(function () { return done(); }, 700);
    });
    it("Should Detect Failure", function (done) {
        fingerTable.on("failure", function (data) {
            done();
        });
    }).timeout(3000);
    it("Should Return All Nodes with smaller ID", function () {
        var entries = fingerTable.getEntriesWithSmallerId(1);
        (0, chai_1.expect)(entries.length).equal(0);
        var entries = fingerTable.getEntriesWithSmallerId(2);
        (0, chai_1.expect)(entries.length).equal(1);
        var entries = fingerTable.getEntriesWithSmallerId(3);
        (0, chai_1.expect)(entries.length).equal(2);
    });
    it("Should Return All Nodes with greater ID", function () {
        var entries = fingerTable.getEntriesWithGreaterId(2);
        (0, chai_1.expect)(entries.length).equal(0);
        var entries = fingerTable.getEntriesWithGreaterId(1);
        (0, chai_1.expect)(entries.length).equal(1);
        var entries = fingerTable.getEntriesWithGreaterId(0);
        (0, chai_1.expect)(entries.length).equal(2);
    });
    it("Should Return no Leader", function () {
        var leader = fingerTable.getLeader();
        (0, chai_1.expect)(leader).equal(null);
    });
    it("Should return Leader", function () {
        var leader = fingerTable3.getLeader();
        console.log(fingerTable3.getEntries());
        (0, chai_1.expect)(leader).not.null;
    });
});
