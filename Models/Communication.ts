import { TypedEmitter } from "tiny-typed-emitter";
import { HTTP } from "./HTTP";
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
  /**Emmits a Heartbeat event */
  heartBeat: (message: MessageI) => void;
  /**Emmits a Listening event to warn it is initialized */
  listening: () => void;
  /**Emmits a Failure event warning that a failure message was received*/
  failure: (siteId: string) => void;
  /**Emmits a Election event warning that an election is happening*/
  election: (message: MessageI) => void;
  /**Emmits a Coordnator event warning that another node is selected the coordnator*/
  coordinator: (message: MessageI) => void;
  /**Emmits a Gossip event warning that a message should be passedforward though gossip*/
  gossip: (message: MessageI) => void;
  /**Emmits a Gossip event warning that a message should be passedforward though gossip*/

  /**Emmits a Query event warning that a query was received*/
  query: (message: MessageI) => void;

  /**Emmits a Restore event warning that another Site is asking for a snapshot of the DB*/
  restoreDB: (message: MessageI) => void;

  /**Emmits a Server Running event warning that the HTTP server is Running*/
  serverRuning: (port:number) => void;
  
  /**Emmits a Get event warning that a Client is asking a Get query*/
  get: (query:string) => void;
  /**Emmits a Set event warning that a Client is asking a Set query*/
  set: (query:string) => void;
  /**Emmits a Delete event warning that a Client is asking a Delete query*/
  delete: (query:string) => void;
}

/**
 * Implementation of a Communication Interface.
 */
export class Communication
  extends TypedEmitter<CommunicationEventsI>
  implements CommunicationI
{
  udp: UDP;
  infected: LimitedList<string>;
  http: HTTP;
  request:Response;
  constructor(listenOnPort: number,serveOnPort:number) {
    super();
    this.udp = new UDP(listenOnPort);
    var self = this;
    this.infected = new LimitedList<string>(1000);
    this.http = new HTTP(serveOnPort);

    //=============================================================================================
    //Event Emmiting Section
    //=============================================================================================
    this.http.on("set",(value) => this.emit("set",value));
    this.http.on("get",(value) => this.emit("get",value));
    this.http.on("delete",(value) => this.emit("delete",value));

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
        case "query":
          this.emit("query", m);
          break;
        case "restoreDB":
            this.emit("restoreDB", m);
            break;
      }
    });
    this.udp.on("listening", () => self.emit("listening"));

    //=============================================================================================
    //End of Event Emmiting Section
    //=============================================================================================
  }

  /**
   * Sends a message to an specific Site.
   * 
   * This method also registers that it is already "infected" by this message. 
   * So it will no send it forward in case o receiving it again.
   * @param message Message Instance that will be sent
   * @param destination Site who will receive this Message
   */
  unicast(message: MessageI, destination: SiteI): void {
    this.infected.input(message.hash);
    this.udp.unicast(message, destination);
  }

   /**
   * Sends a message to a list of specific Sites.
   * 
   * This method also registers that it is already "infected" by this message. 
   * So it will no send it forward in case o receiving it again.
   * @param message Message Instance that will be sent
   * @param sites List of Sites who will receive this Message
   */
  multicast(message: MessageI, sites: SiteI[]): void {
    this.infected.input(message.hash);
    var self = this;
    sites.forEach((s,i) => self.unicast(message, s));
  }

  "message": (message: MessageI) => void;

  /**
   * Sends a message to the Broadcast Address. 
   * 
   * @param message Message Instance that will be sent
   */
  broadcast(message: MessageI) {
    this.udp.broadCast(message);
  }

  /**
   * Responds to the active request on the HTTP interface 
   * 
   * @param value Value to be sent to the client
   */
  respond(value:any){
    this.http.respond(value);
  }
}
