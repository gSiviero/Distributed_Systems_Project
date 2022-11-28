"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var Arguments_1 = require("../Models/Arguments");
require("mocha");
describe("Arguments Test", function () {
    it("Should Instantiate Argument with default value", function () {
        var site = new Arguments_1.Arguments("-p", 8080, []);
        (0, chai_1.expect)(site.value).equal(8080);
    });
    it("Should Instantiate Argument with inputed number", function () {
        var site = new Arguments_1.Arguments("-p", 8080, ["-p", "8081"]);
        (0, chai_1.expect)(site.value).equal(8081);
    });
});
