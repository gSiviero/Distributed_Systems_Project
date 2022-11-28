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
exports.SelfSite = void 0;
var Communication_1 = require("./Communication");
var FingerTable_1 = require("./FingerTable");
var Site_1 = require("./Site");
var config = require("../systemConfig.json");
var Message_1 = require("./Message");
var async_mutex_1 = require("async-mutex");
var Table_1 = require("./Table");
/** This implements a Local Site, where the fingertable and the communication capabilities are implemented.*/
var SelfSite = /** @class */ (function (_super) {
    __extends(SelfSite, _super);
    /**
     *
     * @param ip Local Site's IP.
     * @param port Local Sites Port;
     */
    function SelfSite(ip, port) {
        var _this = _super.call(this, ip, port) || this;
        _this.fingerTable = new FingerTable_1.FingerTable(config.declareFailure);
        _this.fingerTable.upsertEntry(_this);
        _this.infections = [];
        _this.lock = new async_mutex_1.Mutex();
        _this.electionRunning = false;
        _this.communication = new Communication_1.Communication(port !== null && port !== void 0 ? port : config.port, config.possiblePorts);
        _this.consoleTable = new Table_1.ConsoleTable();
        _this.communication.on("heartBeat", function (s) {
            _this.fingerTable.upsertEntry(s.sender);
        });
        _this.fingerTable.on("failure", function (d) {
            var message = Message_1.MessageFactory.FailureDetected(_this, d.id);
            _this.fingerTable.removeEntryById(d.id);
            _this.communication.broadcast(message);
        });
        _this.communication.on("failure", function (s) { return _this.fingerTable.removeEntryById(parseInt(s)); });
        _this.fingerTable.on("join", function (d) {
            return _this.consoleTable.printFingerTable(_this);
        });
        _this.communication.on("coordinator", function (d) {
            _this.lock.acquire();
            if (d.sender.timeStamp > _this.fingerTable.getEntryById(d.sender.id).timeStamp) {
                d.sender.leader = true;
                _this.fingerTable.upsertEntry(d.sender);
                _this.leader = false;
                _this.fingerTable.upsertEntry(_this);
                _this.electionRunning = false;
                clearTimeout(_this.electionTimeOut);
            }
            else {
                console.log("Ignore message");
            }
            _this.lock.release();
        });
        _this.communication.on("election", function () { return _this.checkLeader(); });
        setInterval(function () {
            _this.timeStamp += 1;
            _this.checkLeader();
            _this.communication.broadcast(Message_1.MessageFactory.HeartBeatMessage(_this));
            _this.consoleTable.printFingerTable(_this);
        }, 1000);
        return _this;
    }
    SelfSite.prototype.checkLeader = function () {
        var _this = this;
        this.lock.acquire();
        if (!this.fingerTable.getLeader() && !this.electionRunning) {
            this.timeStamp += 1;
            this.electionRunning = true;
            var entries = this.fingerTable.getEntriesWithGreaterId(this.id);
            if (entries)
                this.communication.multicast(Message_1.MessageFactory.EllectionMessage(this), entries);
            this.electionTimeOut = setTimeout(function () {
                _this.lock.acquire();
                _this.timeStamp += 1;
                var entries = _this.fingerTable.getEntriesWithSmallerId(_this.id);
                _this.communication.multicast(Message_1.MessageFactory.CoordinatorMessage(_this), entries);
                _this.lock.release();
            }, 300);
        }
        else if (this.fingerTable.getLeader() && this.electionRunning) {
            clearTimeout(this.electionTimeOut);
            this.electionRunning = false;
        }
        this.lock.release();
    };
    return SelfSite;
}(Site_1.Site));
exports.SelfSite = SelfSite;
