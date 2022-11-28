"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Base = void 0;
/**Definitaion of Base Class */
var Base = /** @class */ (function () {
    /**Constructor, instantiate Base object */
    function Base() {
        this._errors = [];
    }
    /**Validate a property
     * @param property name of property to be validate
     */
    Base.prototype.validateNotNull = function (property) {
        if (this[property] == null || this[property] == undefined)
            this._errors.push("".concat(property, " cannot be null or undefined"));
    };
    /**Throw exception based on errors detected. */
    Base.prototype.validateObject = function () {
        if (this._errors.length > 0) {
            throw (this._errors);
        }
    };
    return Base;
}());
exports.Base = Base;
