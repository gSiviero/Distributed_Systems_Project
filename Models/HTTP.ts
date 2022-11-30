import { Express, Request, Response } from 'express';
import { TypedEmitter } from "tiny-typed-emitter";
import { MessageI } from './Message';
const express = require("express");

export interface HTTPEventsI {
    set: (object: any) => void;
    get: (id: string) => void;
    delete: (id: string) => void;
}

export class HTTP extends  TypedEmitter<HTTPEventsI>{
    server:Express;
    private response:Response;

    constructor(port:number){
        super();
        this.server = express();
        this.server.use(express.json());
        this.server.listen(port,() =>{
            this.emit("set",port);
        });
        
        this.server.get('/', (req: Request, res: Response) => {
          this.response = res;
          this.emit("get",req.query.id as string);
        });
        
        this.server.post('/', (req: Request, res: Response) => {
          this.response = res;
          this.emit("set",req.body);
        });

        this.server.delete('/', (req: Request, res: Response) => {
            this.response = res;
            this.emit("delete",req.body.id as string);
          });

    }

    respond(value:string){
            this.response.send(value);
    }

}