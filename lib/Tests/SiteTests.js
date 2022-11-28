"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SelfSite_1 = require("../Models/SelfSite");
var validIp1 = "localhost";
var validPort1 = 8080;
describe("Site test", function () {
    it("Should Instantiate Site Correctly", function () {
        var site = new SelfSite_1.SelfSite(validIp1, validPort1);
        console.log(site);
    });
});
