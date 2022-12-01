import { Express, Request, Response } from 'express';
import { TypedEmitter } from "tiny-typed-emitter";
import { MessageI } from './Message';
const express = require("express");

/**
 * Declaration of possible Events
 */
export interface HTTPEventsI {
    /**Emits a set event with a json object containing id and value to be handled*/
    set: (object: any) => void;
    /**Emits a get event with a string containing the id to be fetched*/
    get: (id: string) => void;
    /**Emits a get event with a string containing the id to be deleted*/
    delete: (id: string) => void;
}

/**
 * DImplementation of HTTP Class
 */
export class HTTP extends  TypedEmitter<HTTPEventsI>{
    server:Express;
    private response:Response;

    /**
     * Constructor
     * @param port Port where the HTTP server will listen
     */
    constructor(port:number){
        super();
        this.server = express();
        this.server.use(express.json());
        this.server.listen(port,() =>{
            this.emit("set",port);
        });
        
        /**
         * Get endpoint on path /
         * The request must have a id prorperty in its URL query.
         * This will emmit a get event to later be handled by the SelfSite Class
         */
        this.server.get('/', (req: Request, res: Response) => {
          this.response = res;
          this.emit("get",req.query.id as string);
        });
        
        /**
         * Post endpoint on path /
         * The request must have a id and value prorperties in its body.
         * This will emmit a set event to later be handled by the SelfSite Class
         */
        this.server.post('/', (req: Request, res: Response) => {
          this.response = res;
          this.emit("set",req.body);
        });

        /**
         * Post endpoint on path /
         * The request must have a id prorperty in its body.
         * This will emmit a delete event to later be handled by the SelfSite Class
         */
        this.server.delete('/', (req: Request, res: Response) => {
            this.response = res;
            this.emit("delete",req.body.id as string);
          });

    }

    /** 
     * Send the active response back to the client.
     */
    respond(value:string){
            this.response.send(value);
    }

}