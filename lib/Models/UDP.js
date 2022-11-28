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
exports.UDP = void 0;
var dgram = require("dgram");
var tiny_typed_emitter_1 = require("tiny-typed-emitter");
/**Implementation of UDP connection */
var UDP = /** @class */ (function (_super) {
    __extends(UDP, _super);
    /**
     * Instantiates a new UDP service.
     * @param serverPort Listen on this port for connections
     * @param possiblePorts Possible ports for nodes to operate
     */
    function UDP(serverPort, possiblePorts) {
        var _this = _super.call(this) || this;
        _this.possiblePorts = possiblePorts;
        var server = dgram.createSocket("udp4");
        server.bind(serverPort, function () { return server.setBroadcast(true); });
        server.on("listening", function () { return _this.emit("listening"); });
        server.on("message", function (d) { return _this.emit("message", JSON.parse(d)); });
        _this.client = dgram.createSocket("udp4");
        return _this;
    }
    /**Broadcast to all IPs in the network listening on all Ports defined in this.possiblePorts */
    UDP.prototype.broadCast = function (message) {
        var _this = this;
        this.possiblePorts.forEach(function (port) { return _this.client.send(Buffer.from(JSON.stringify(message)), port); });
    };
    UDP.prototype.unicast = function (message, destination) {
        this.client.send(Buffer.from(JSON.stringify(message)), destination.port, destination.ip);
    };
    return UDP;
}(tiny_typed_emitter_1.TypedEmitter));
exports.UDP = UDP;
