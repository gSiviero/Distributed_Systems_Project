import * as dgram from "dgram";
import { MessageI } from "./Message";
import { TypedEmitter } from "tiny-typed-emitter";
import { SiteI } from "./Site";
import * as config from "../systemConfig.json";

/**Interface that defines UDP methods and events. */
export interface UDPI {
  /**Broadcast to  all*/
  broadcast(message: MessageI): void;
  /**Event fired when UDP starts listening */
  listening: () => void;
  /**Event fired when UDP receives a message */
  message: (message: any) => void;
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
   */
  constructor(serverPort: number) {
    super();
    const server = dgram.createSocket("udp4");
    server.bind(serverPort, () => {
      server.setBroadcast(true);
      server.setMulticastTTL(128);
      server.addMembership(config.multicastAddress); 
    });
    server.on("listening", () => this.emit("listening"));
    server.on("message", (d: string) => this.emit("message", JSON.parse(d)));
    this.client = dgram.createSocket("udp4");
    this.client.bind(() => {
      this.client.setBroadcast(true);
      this.client.setMulticastTTL(128); 
      this.client.addMembership(config.multicastAddress);
    });
  }

   /**
   * Sends a message to all sites in the network.
   * @param message Message to be sent to all Sites in the Network
   */
  broadCast(message: any) {
      this.client.send(Buffer.from(JSON.stringify(message)), config.port,config.multicastAddress);
  }

  /**
   * Sends a message to a single site in the network.
   * @param message Message to be Sent
   * @param destination Site that will receive this message.
   */
  unicast(message: MessageI,destination:SiteI) {
    this.client.send(Buffer.from(JSON.stringify(message)), destination.port, destination.ip);
  }
}
