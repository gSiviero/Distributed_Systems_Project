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
exports.FingerTable = exports.FingerTableSite = void 0;
var tiny_typed_emitter_1 = require("tiny-typed-emitter");
var Site_1 = require("./Site");
var async_mutex_1 = require("async-mutex");
/**This class describes an entry in the finger table*/
var FingerTableSite = /** @class */ (function (_super) {
    __extends(FingerTableSite, _super);
    function FingerTableSite(site) {
        var _this = _super.call(this, site.ip, site.port, site.id, site.leader) || this;
        _this.timeStamp = site.timeStamp;
        _this.clock = new Date();
        return _this;
    }
    FingerTableSite.prototype.updateTimeStamp = function (site) {
        this.timeStamp = site.timeStamp;
        this.leader = site.leader;
        this.clock = new Date();
    };
    return FingerTableSite;
}(Site_1.Site));
exports.FingerTableSite = FingerTableSite;
/**Finger Table implementation */
var FingerTable = /** @class */ (function (_super) {
    __extends(FingerTable, _super);
    /**Constructor
     * @param seconds Number of seconds to declare a site failure.
     */
    function FingerTable(seconds) {
        var _this = _super.call(this) || this;
        /**Return all Entries in the Finger Table
         * @return Array of Entries
        */
        _this.getEntries = function () { return _this.entries.map(function (e) { return e.toJson(); }); };
        _this.secconds = seconds;
        _this.entries = [];
        _this.lock = new async_mutex_1.Mutex();
        setInterval(function () {
            _this.removeFailuredEntries();
        }, seconds * 1000);
        return _this;
    }
    /**Insert or update an entry in the finger table.
     *
     * If an entry with the same Id is already in the fingertable it compares the Lamport Time Stamp.
     * If the new TimeStamp is greater than it updates the entry with the new TimeStamp as well as the the new Local Date Time.
     *
     * @param {site} site  The Site to be updated or inserted
    */
    FingerTable.prototype.upsertEntry = function (site) {
        this.lock.acquire();
        var entry = this.getEntryById(site.id);
        if (entry == null) {
            entry = new FingerTableSite(site);
            this.entries.push(entry);
            if (entry.timeStamp == 1)
                this.emit("join", entry);
        }
        else if (site.timeStamp > entry.timeStamp) {
            entry.updateTimeStamp(site);
        }
        this.lock.release();
    };
    /**Remove Failured Entries from Finger Table
     *
     * After removing emmits an event ("failure") caring the list of failured entries.
    */
    FingerTable.prototype.removeFailuredEntries = function () {
        var _this = this;
        this.lock.acquire();
        var timeCut = new Date();
        timeCut.setSeconds(timeCut.getSeconds() - this.secconds);
        var listOfFailures = this.entries.filter(function (e) { return e.clock < timeCut; });
        this.entries = this.entries.filter(function (e) { return e.clock > timeCut; });
        if (listOfFailures.length > 0) {
            console.log("I just detected a Failre, letting other nodes know.");
            listOfFailures.forEach(function (s) { return _this.emit("failure", s); });
        }
        this.lock.release();
    };
    /**Return a Finger Table Entry based on the Id.
     * @param id Id to be searched.
     * @return Finger Table Entry with matching Id, if there is none than returns null.
    */
    FingerTable.prototype.getEntryById = function (id) {
        var entries = this.entries.filter(function (e) { return e.id == id; });
        return entries.length > 0 ? entries[0] : null;
    };
    /**Return a Finger Table Entry based on the Id.
     * @param id Id to be searched.
     * @return Finger Table Entry with matching Id, if there is none than returns null.
    */
    FingerTable.prototype.removeEntryById = function (id) {
        this.lock.acquire();
        this.entries = this.entries.filter(function (e) { return e.id != id; });
        this.lock.release();
    };
    /**Randomly Pic a  */
    FingerTable.prototype.randomlyPickEntry = function () {
        var index = Math.floor(Math.random() * this.entries.length);
        return index > 0 ? this.entries[index] : null;
    };
    FingerTable.prototype.getEntriesWithSmallerId = function (id) {
        return this.entries.filter(function (n) { return id > n.id; });
    };
    FingerTable.prototype.getEntriesWithGreaterId = function (id) {
        return this.entries.filter(function (n) { return id < n.id; });
    };
    FingerTable.prototype.getLeader = function () {
        var entries = this.entries.filter(function (n) { return n.leader == true; });
        return entries.length > 0 ? entries[0] : null;
    };
    FingerTable.prototype.setLeader = function (id) {
        this.entries.forEach(function (e) {
            e.leader = id == e.id;
        });
    };
    return FingerTable;
}(tiny_typed_emitter_1.TypedEmitter));
exports.FingerTable = FingerTable;
