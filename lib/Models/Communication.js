"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Communication = void 0;
var tiny_typed_emitter_1 = require("tiny-typed-emitter");
var UDP_1 = require("./UDP");
var Communication = /** @class */ (function (_super) {
    __extends(Communication, _super);
    function Communication(listenOnPort, possiblePorts) {
        var _this = _super.call(this) || this;
        _this.udp = new UDP_1.UDP(listenOnPort, possiblePorts);
        var self = _this;
        _this.udp.on("message", function (m) {
            switch (m.topic) {
                case "heartBeat":
                    _this.emit("heartBeat", m);
                    break;
                case "failure":
                    _this.emit("failure", m.payload);
                    break;
                case "election":
                    _this.emit("election", m);
                case "coorditator":
                    _this.emit("coordinator", m);
                    break;
            }
        });
        _this.udp.on("listening", function () { return self.emit("listening"); });
        return _this;
    }
    Communication.prototype.unicast = function (message, destination) {
        this.udp.unicast(message, destination);
    };
    Communication.prototype.multicast = function (message, sites) {
        var self = this;
        sites.forEach(function (s) { return self.unicast(message, s); });
    };
    Communication.prototype.broadcast = function (message) {
        this.udp.broadCast(message);
    };
    return Communication;
}(tiny_typed_emitter_1.TypedEmitter));
exports.Communication = Communication;
