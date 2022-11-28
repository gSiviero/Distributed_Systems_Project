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
exports.Site = void 0;
var ts_md5_1 = require("ts-md5");
var Base_1 = require("./Base");
/**Definition of a generic Site. It does not implement communication or fingertable.
 * For the Local Site use the class SelfSite.
 */
var Site = /** @class */ (function (_super) {
    __extends(Site, _super);
    /**Communication Class, usedto receive and send messages accross the network */
    /** Instantiates a new Site.
     * @param ip Site's IP
     * @param port  Site's Port that the system is running
     */
    function Site(ip, port, id, leader) {
        var _this = _super.call(this) || this;
        _this.toJson = function () { return ({ ip: _this.ip, id: _this.id, port: _this.port, timeStamp: _this.timeStamp, leader: _this.leader }); };
        _this.ip = ip;
        _this.validateNotNull("ip");
        _this.port = port;
        _this.validateNotNull("port");
        _this.validateObject();
        _this.timeStamp = 0;
        _this.leader = leader !== null && leader !== void 0 ? leader : false;
        _this.id = id !== null && id !== void 0 ? id : parseInt(ts_md5_1.Md5.hashStr(ip + port.toString()), 16) % 255;
        return _this;
    }
    return Site;
}(Base_1.Base));
exports.Site = Site;
