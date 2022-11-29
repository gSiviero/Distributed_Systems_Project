import { TypedEmitter } from "tiny-typed-emitter";
import { LimitedList } from "./LimitedList";
import { MessageI } from "./Message";
import { SiteI } from "./Site";
import { UDP } from "./UDP";
import { Express, Request, Response } from 'express';
const express = require("express");

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
  queryResult: (message: MessageI) => void;
  query: (message: MessageI) => void;
  restoreDB: (message: MessageI) => void;
  serverRuning: (port:number) => void;
  get: (query:string) => void;
  set: (query:string) => void;
}

export class Communication
  extends TypedEmitter<CommunicationEventsI>
  implements CommunicationI
{
  udp: UDP;
  infected: LimitedList<string>;
  http: Express;
  request:Response;
  constructor(listenOnPort: number,serveOnPort:number) {
    super();
    this.udp = new UDP(listenOnPort);
    var self = this;
    this.infected = new LimitedList<string>(1000);
    this.http = express();

    this.http.listen(serveOnPort,() =>{
        this.emit("serverRuning",serveOnPort);
    });

    this.http.get('/', (req: Request, res: Response) => {
      this.request = res;
      this.emit("get",req.query.id as string);
    });

    this.http.get('/set', (req: Request, res: Response) => {
      this.request = res;
      this.emit("set",req.query.value as string);
    });

    this.udp.on("message", (m) => {
      if(this.infected.has(m.hash))
        return;
      this.infected.input(m.hash);
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
        case "queryResult":
          this.emit("queryResult", m);
          break;
        case "query":
          this.emit("query", m);
          break;
        case "restoreDB":
            this.emit("restoreDB", m);
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
    sites.forEach((s,i) => self.unicast(message, s));
  }

  "message": (message: MessageI) => void;

  broadcast(message: MessageI) {
    this.udp.broadCast(message);
  }

  query(message: MessageI,destination: SiteI) {
    this.udp.unicast(message,destination);
  }

  reespond(resp:string) {
    this.request.send(resp);
    // this.request = null;
  }
}
