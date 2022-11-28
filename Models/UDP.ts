import * as dgram from "dgram";
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
export class UDP extends TypedEmitter<UDPI> {
  /**UDP client implementatation. */
  private client: any;
  /**Possible ports configured in the system, this property is necessary when testing the distributed system in only one machine. */
  private possiblePorts: number[];
  /**
   * Instantiates a new UDP service.
   * @param serverPort Listen on this port for connections
   * @param possiblePorts Possible ports for nodes to operate
   */
  constructor(serverPort: number, possiblePorts: number[]) {
    super();
    this.possiblePorts = possiblePorts;
    const server = dgram.createSocket("udp4");
    server.bind(serverPort, () => server.setBroadcast(true));
    server.on("listening", () => this.emit("listening"));
    server.on("message", (d: string) => this.emit("message", JSON.parse(d)));
    this.client = dgram.createSocket("udp4");
    this.client.bind(() => server.setBroadcast(true));
  }

  /**Broadcast to all IPs in the network listening on all Ports defined in this.possiblePorts */
  broadCast(message: MessageI) {
    for(var i = 1;i<255;i++){
      setTimeout(()=> this.client.send(Buffer.from(JSON.stringify(message)), 8080,`10.0.16.${i}`),10)
    }
  }

  unicast(message: MessageI,destination:SiteI) {
    this.client.send(Buffer.from(JSON.stringify(message)), destination.port, destination.ip);
  }
}
