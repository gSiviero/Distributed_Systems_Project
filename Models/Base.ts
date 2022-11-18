/**Definitaion of Base Class */
export class Base{
    /**Private List of Errors */
    private _errors:string[];
    /**Constructor, instantiate Base object */
    constructor (){
        this._errors = [];
    }

    /**Validate a property
     * @param property name of property to be validate
     */
    validateNotNull(property:string):void{
        if(this[property] == null || this[property] == undefined)
            this._errors.push(`${property} cannot be null or undefined`);
    }

    /**Throw exception based on errors detected. */
    validateObject():void{
        if(this._errors.length > 0){
            throw(this._errors);
        }
    }
}