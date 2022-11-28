import { MessageI } from "./Message";
import { TypedEmitter } from "tiny-typed-emitter";
import { SiteI } from "./Site";
/**Interface that defines UDP methods and events. */
export interface UDPI {
    /**Broadcast to  all*/
    broadcast(message: MessageI): void;
    /**Event fired when UDP starts listening */
    listening: () => void;
    /**Event fired when UDP receives a message */
    message: (message: MessageI) => void;
}
/**Implementation of UDP connection */
export declare class UDP extends TypedEmitter<UDPI> {
    /**UDP client implementatation. */
    private client;
    /**Possible ports configured in the system, this property is necessary when testing the distributed system in only one machine. */
    private possiblePorts;
    /**
     * Instantiates a new UDP service.
     * @param serverPort Listen on this port for connections
     * @param possiblePorts Possible ports for nodes to operate
     */
    constructor(serverPort: number, possiblePorts: number[]);
    /**Broadcast to all IPs in the network listening on all Ports defined in this.possiblePorts */
    broadCast(message: MessageI): void;
    unicast(message: MessageI, destination: SiteI): void;
}
