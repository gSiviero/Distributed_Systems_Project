
import { TypedEmitter } from 'tiny-typed-emitter';
import { Md5 } from 'ts-md5';
import { SiteI } from './Site';
import { UDP } from './UDP';

export interface CommunicationI{
    broadcast(message:MessageI):void;
    unicast(site:SiteI):void;
    multicast(site:SiteI[]):void;
}

export interface CommunicationEventsI{
    'message': (message:MessageI) => void;
    'listening': () => void;
}

export class Communication extends TypedEmitter<CommunicationEventsI> implements CommunicationI {
    udp:UDP;
    constructor(listenOnPort:number,possiblePorts:number[]){
        console.log(listenOnPort);
        super();
        this.udp = new UDP(listenOnPort,possiblePorts);
        this.udp.on("listening",() => this.emit("listening"));
        this.udp.on("message",(m) => this.emit("message",JSON.parse(m.toString())));
    }
    unicast(site: SiteI): void {
        throw new Error('Method not implemented.');
    }
    multicast(site: SiteI[]): void {
        throw new Error('Method not implemented.');
    }
    'message': (message: MessageI) => void;

    broadcast(message:MessageI){
        this.udp.broadCast(message);
    }
}
export interface MessageI{
    hash:string;
    sender:SiteI;
    topic: string;
    payload:string;
}

export class Message implements MessageI{
    hash: string;
    sender: SiteI;
    topic: string;
    payload: string;
    
    constructor(sender:SiteI,topic:string,payload:string ){
        this.sender = sender;
        this.topic = topic;
        this.payload = payload;
        this.hash = Md5.hashStr(JSON.stringify(this));
    }
}
