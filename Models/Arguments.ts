export class Arguments<T>{
    value:T;
    constructor(discrimitator:string,defaultValue:T,cmd:string[]){
        this.value = defaultValue;
        if(cmd.length > 0){
            var indexOfArgument = cmd.indexOf(discrimitator);
            if(indexOfArgument > -1){
                var inputValue = cmd[indexOfArgument+1];
                this.value = parseInt(inputValue) as T;
                }
            }
        }
}
