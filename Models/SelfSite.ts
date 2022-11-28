import { Communication, CommunicationI } from "./Communication";
import { FingerTable, FingerTableI } from "./FingerTable";
import { Site, SiteI } from "./Site";
import * as config from "../systemConfig.json";
import { MessageFactory, MessageI } from "./Message";
import { Mutex } from "async-mutex";
import { ConsoleTable } from "./Table";

export interface SelfSiteI extends SiteI {
  communication: CommunicationI;
  fingerTable: FingerTableI;
  toJson(): SiteI;
}

/** This implements a Local Site, where the fingertable and the communication capabilities are implemented.*/
export class SelfSite extends Site implements SelfSiteI {
  /**Fingertable Manager, it keeps track of other sites in the network.*/
  fingerTable: FingerTable;
  /**Communication implementation, this is an abstraction of the possible communication methods.*/
  communication: Communication;
  infections: string[];
  lock: Mutex;
  electionRunning: boolean;
  electionTimeOut: NodeJS.Timeout;
  consoleTable: ConsoleTable;
  /**
   *
   * @param ip Local Site's IP.
   * @param port Local Sites Port;
   */
  constructor(ip: string, port: number, id?: number) {
    super(ip, port, id);
    this.fingerTable = new FingerTable(config.declareFailure);
    this.fingerTable.upsertEntry(this as Site);
    this.infections = [];
    this.lock = new Mutex();
    this.electionRunning = false;
    this.communication = new Communication(
      port ?? config.port,
      config.possiblePorts
    );

    this.consoleTable = new ConsoleTable();

    this.communication.on("heartBeat", (s) => {
      this.fingerTable.upsertEntry(s.sender);
    });

    this.fingerTable.on("failure", (d) => {
      this.fingerTable.removeEntryById(d.id);
      this.consoleTable.log(`Failure Detected ${d.id}`);
      this.gossip(MessageFactory.FailureDetected(this,d.id));
    });

    

    this.communication.on("failure", (s) => {
      this.consoleTable.log(`Failure Detected By other Node ${s}`);
      this.fingerTable.removeEntryById(parseInt(s));
      this.checkLeader();
    });

    this.fingerTable.on("join", (d) => {
      this.consoleTable.log(`Node Discovered ${d.id}`);
    });

    this.communication.on("coordinator", (d) => {
      if (d.sender.id > this.id) {
        this.lock.acquire();
        this.leader = false;
        this.fingerTable.upsertEntry(this);
        this.fingerTable.upsertEntry(d.sender);
        this.fingerTable.setLeader(d.sender);
        this.electionRunning = false;
        clearTimeout(this.electionTimeOut);
        this.lock.release();
      }
    });

    this.communication.on("election", () => {this.checkLeader()});

    setInterval(() => {
      this.timeStamp += 1;
      this.checkLeader();
      this.communication.broadcast(MessageFactory.HeartBeatMessage(this));
    }, config.heartBeatInterval);

    
  setInterval(() => {this.consoleTable.printFingerTable(this)},1000);
  }

  private gossip(message:MessageI){
    this.communication.unicast(message,this.fingerTable.randomlyPickEntry());
    this.communication.unicast(message,this.fingerTable.randomlyPickEntry());
  }

  private checkLeader() {
    this.lock.acquire();
    if (!this.fingerTable.getLeader() && !this.electionRunning) {
      this.timeStamp += 1;
      this.electionRunning = true;
      var entries = this.fingerTable.getEntriesWithGreaterId(this.id);

      if (entries.length > 0)
        this.communication.broadcast(MessageFactory.EllectionMessage(this));
      else{ 
        this.electionTimeOut = setTimeout(() => {
          this.lock.acquire();
          this.leader = true;
          var entries2 = this.fingerTable.getEntriesWithSmallerId(this.id);
          this.communication.multicast(
            MessageFactory.CoordinatorMessage(this),
            entries2
          );
          this.lock.release();
        }, config.electionTimeout);
      }
      
     
    } else if (this.fingerTable.getLeader() && this.electionRunning) {
      this.electionRunning = false;
    }
    this.lock.release();
  }
}
