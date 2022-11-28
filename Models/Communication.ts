import { TypedEmitter } from "tiny-typed-emitter";
import { LimitedList } from "./LimitedList";
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
  gossip: (message: MessageI) => void;
}

export class Communication
  extends TypedEmitter<CommunicationEventsI>
  implements CommunicationI
{
  udp: UDP;
  infected: LimitedList<string>;
  constructor(listenOnPort: number, possiblePorts: number[]) {
    super();
    this.udp = new UDP(listenOnPort, possiblePorts);
    var self = this;
    this.infected = new LimitedList<string>(100);
    this.udp.on("message", (m) => {
      if(this.infected.has(m.hash))
        return;
      if(m.gossip){
        this.emit("gossip",m);
      }
      switch (m.topic) {
        case "heartBeat":
          this.emit("heartBeat", m);
          break;
        case "failure":
          this.emit("failure", m.payload);
          break;
        case "election":
          this.emit("election", m);
          break;
        case "coordinator":
          this.emit("coordinator", m);
          break;
      }
    });
    this.udp.on("listening", () => self.emit("listening"));
  }

  unicast(message: MessageI, destination: SiteI): void {
    this.infected.input(message.hash);
    this.udp.unicast(message, destination);
  }

  multicast(message: MessageI, sites: SiteI[]): void {
    this.infected.input(message.hash);
    var self = this;
    sites.forEach((s) => self.unicast(message, s));
  }

  "message": (message: MessageI) => void;

  broadcast(message: MessageI) {
    this.udp.broadCast(message);
  }
}
