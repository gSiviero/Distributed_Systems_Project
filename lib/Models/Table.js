"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleTable = void 0;
var Table = require("cli-table");
var chalk = require("chalk");
/**Definition of a generic Site. It does not implement communication or fingertable.
 * For the Local Site use the class SelfSite.
 */
var ConsoleTable = /** @class */ (function () {
    function ConsoleTable() {
        this.table = new Table({
            head: ['Node', 'TimeStamp', "Leader"],
            colWidths: [10, 10, 10]
        });
    }
    ConsoleTable.prototype.printFingerTable = function (site) {
        var _this = this;
        console.clear();
        var entries = site.fingerTable.getEntries().sort(function (a, b) { return a.id - b.id; });
        this.table = new Table({
            head: ["Node", 'TimeStamp', "Leader"],
            colWidths: [10, 10, 10]
        });
        entries.forEach(function (e) {
            var isSelf = e.id == site.id;
            _this.table.push([_this.underScore(e.id, isSelf), _this.underScore(e.timeStamp, isSelf), _this.underScore(e.leader ? "X" : "", isSelf)]);
        });
        if (site.electionRunning)
            console.log("Election is Running");
        console.log(this.table.toString());
    };
    ConsoleTable.prototype.underScore = function (text, yes) {
        return yes ? chalk.blue(text) : text;
    };
    return ConsoleTable;
}());
exports.ConsoleTable = ConsoleTable;
