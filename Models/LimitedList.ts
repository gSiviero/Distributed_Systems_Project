export class LimitedList<T>{
    /**Clock on the local machine when this Site was last updated.*/
    inputs:number;
    array: T[];
    size:number;
    constructor(size:number){
        this.size = size;
        this.inputs = 0;
        this.array = [];
    }

    actualPosition(){
        return this.inputs % this.size;
    }
    
    input(element:T){
        if(this.has(element))
            return;
        this.array[this.actualPosition()] = element;
        this.inputs++;
    }

    has(element:T){
        return this.array.indexOf(element) != -1;
    }

    getOrdered(){
        var ret = [];
        for(var i = 0;i <this.size;i++){
            if(this.array[(this.actualPosition() + i) % this.size])
                ret.push(this.array[(this.actualPosition() + i) % this.size]);
        }
        return ret;
    }
}