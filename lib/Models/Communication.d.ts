import { TypedEmitter } from "tiny-typed-emitter";
import { MessageI } from "./Message";
import { SiteI } from "./Site";
import { UDP } from "./UDP";
export interface CommunicationI {
    broadcast(message: MessageI): void;
    unicast(message: MessageI, destination: SiteI): void;
    multicast(message: MessageI, sites: SiteI[]): void;
}
export interface CommunicationEventsI {
    message: (message: MessageI) => void;
    heartBeat: (message: MessageI) => void;
    listening: () => void;
    failure: (siteId: string) => void;
    election: (message: MessageI) => void;
    coordinator: (message: MessageI) => void;
}
export declare class Communication extends TypedEmitter<CommunicationEventsI> implements CommunicationI {
    udp: UDP;
    constructor(listenOnPort: number, possiblePorts: number[]);
    unicast(message: MessageI, destination: SiteI): void;
    multicast(message: MessageI, sites: SiteI[]): void;
    "message": (message: MessageI) => void;
    broadcast(message: MessageI): void;
}
