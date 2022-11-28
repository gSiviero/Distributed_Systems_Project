"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Arguments_1 = require("./Models/Arguments");
var SelfSite_1 = require("./Models/SelfSite");
var port = new Arguments_1.Arguments("-p", 8080, process.argv);
var site = new SelfSite_1.SelfSite("localhost", port.value);
