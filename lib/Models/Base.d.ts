/**Definitaion of Base Class */
export declare class Base {
    /**Private List of Errors */
    private _errors;
    /**Constructor, instantiate Base object */
    constructor();
    /**Validate a property
     * @param property name of property to be validate
     */
    validateNotNull(property: string): void;
    /**Throw exception based on errors detected. */
    validateObject(): void;
}
