/**This class represents a list with unique values to be used in the gosspi protocol */
export class LimitedList<T>{
    /**Number of elements in the list*/
    inputs:number;
    /**Array conetaining the elements*/
    array: T[];
    /**Maximum size of the list */
    size:number;
    constructor(size:number){
        this.size = size;
        this.inputs = 0;
        this.array = [];
    }

    /**
     * 
     * @param element Element to be insert in the list
     */
    input(element:T):void{
        if(this.has(element))
            return;
        this.array[this.inputs % this.size] = element;
        this.inputs++;
    }

    /**
     * Checks if the element is already in the list
     * @param element Element to be checked
     * @returns True if the list already contains the element, false otherwise
     */
    has = (element:T):boolean => this.array.indexOf(element) != -1;
}