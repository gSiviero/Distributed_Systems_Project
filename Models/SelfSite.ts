import { Communication, CommunicationI } from "./Communication";
import { FingerTable } from "./FingerTable";
import { Site, SiteI } from "./Site";
import * as config from "../systemConfig.json";
import { MessageFactory, MessageI } from "./Message";
import { Mutex } from "async-mutex";
import { ConsoleDashboard } from "./DashBoard";
import { SimpleDB } from "../DataBase/SimpleDB";
import * as chalk from "chalk";

export interface SelfSiteI extends SiteI {
  communication: CommunicationI;
  fingerTable: FingerTable;
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
  consoleTable: ConsoleDashboard;
  db: SimpleDB;
  /**
   *
   * @param ip Local Site's IP.
   * @param port Local Sites Port;
   */
  constructor(ip: string, port: number, id?: number) {
    super(ip, port, id,false,false,config.serverPort);
    this.fingerTable = new FingerTable(config.declareFailure);
    this.fingerTable.upsertEntry(this as Site);
    this.infections = [];
    this.lock = new Mutex();
    this.electionRunning = false;
    this.communication = new Communication(
      port ?? config.port, this.serverPort
    );

    this.db = new SimpleDB(this.port);
    this.consoleTable = new ConsoleDashboard();

    this.communication.on("listening", () => {
        this.communication.on("heartBeat", (s) => this.fingerTable.upsertEntry(s.sender));

        //=============================================================================================
        // Failure Detection and Resource Discovery Section
        //=============================================================================================

        this.fingerTable.on("failure", (d) => {
          this.lock.acquire();
          this.timeStamp += 1;
          this.fingerTable.removeEntryById(d.id);
          this.consoleTable.log(chalk.underline.red(`Failure Detected ${d.id}`));
          this.gossip(MessageFactory.FailureDetected(this, d.id));
          this.lock.release();
          this.checkLeader();
        });


        this.fingerTable.on("join", (d) => {
          this.timeStamp += 1;
          this.consoleTable.log(`Node Discovered : ${d.id}`);
          if(this.leader)
            this.communication.unicast(MessageFactory.RestoreDBMessage(this,this.db.getBkp()),d);
        });

        this.communication.on("failure", (s) => {
          this.timeStamp += 1;
          this.consoleTable.log(`Failure Detected By other Node ${s}`);
          this.fingerTable.removeEntryById(parseInt(s));
          this.checkLeader();
        });

        //=============================================================================================
        // End of Failure Detection and Resource Discovery Section
        //=============================================================================================

    
        //=============================================================================================
        // Client Interaction Section
        //=============================================================================================

        /**The HTTP server has started */
        this.communication.on("serverRuning",(d) => this.consoleTable.log(`Server is Running on Port ${d}`));

        /**A Client requested some data */
        this.communication.on("get",(id) => {
          this.consoleTable.log(`Get ${id}`);
          this.communication.respond(this.db.get(id));
        });

        /**A Client is setting some data */
        this.communication.on("set",(value) => {
          this.consoleTable.log(`Set ${value}`);
          this.gossip(MessageFactory.QueryMessage(this,value))
          this.communication.respond(this.db.insert(value));
        });

        /**A Client is deleting some data */
        this.communication.on("delete",(value) => {
          this.consoleTable.log(`Delete ${value}`);
          this.gossip(MessageFactory.QueryMessage(this,value))
          this.communication.respond(this.db.delete(value));
        });

        //=============================================================================================
        // End of Client Interaction Section
        //=============================================================================================


        //=============================================================================================
        // DB Interaction Section
        //=============================================================================================
        this.communication.on("query", (s) => {
          this.consoleTable.log(`Set (gossip) ${s.payload}`);
          this.timeStamp +=1 ;
          this.gossip(s);
          this.db.insert(s.payload);
        });

        this.communication.on("restoreDB",(m)=>{
          this.consoleTable.log(`Restore DB`);
          var ret = this.db.restore(JSON.stringify(m.payload));
          this.consoleTable.log(ret);
        });

        //=============================================================================================
        // End of DB Interaction Section
        //=============================================================================================


        //=============================================================================================
        // Election Section
        //=============================================================================================

        //Starts the election process if an election event occurs
        this.communication.on("election", () => this.checkLeader());

        //Stops the election process if a coordinator event occurs
        this.communication.on("coordinator", (d) => {
          this.consoleTable.log(chalk.bold.blue(`Leader Elected: ${d.sender.id}`));
          if (d.sender.id > this.id) {
            this.lock.acquire();
            this.timeStamp += 1;
            this.leader = false;
            this.fingerTable.upsertEntry(this);
            this.fingerTable.upsertEntry(d.sender);
            this.electionRunning = false;
            clearTimeout(this.electionTimeOut);
            this.lock.release();
          }
        });


        //Forward a gossip message
        this.communication.on("gossip",(m) => this.gossip(m));
        

        //=============================================================================================
        // Timers Section
        //=============================================================================================

        //Sends a HB message
        setInterval(() => {
          this.communication.broadcast(MessageFactory.HeartBeatMessage(this));
          this.fingerTable.upsertEntry(this);
        }, config.heartBeatInterval);

        //Check Leader
        setInterval(() => this.checkLeader(), 2000);

        //Renders the Dashboard
        setInterval(() => this.consoleTable.printFingerTable(this), 1000);

        //=============================================================================================
        // Timers Section
        //=============================================================================================
        
        this.communication.broadcast(MessageFactory.HeartBeatMessage(this));
  });
  }

  /**
   * Sends a message trough Gossip
   * @param message Message to be sent
   */
  private gossip(message: MessageI):void {
    message.gossip=true;
    var destination = this.fingerTable.randomlyPickEntry(this,message.sender);
    if(destination)
      this.communication.unicast(message,destination );
  }


  /**
   * Check if there is still a leader and start the election process otherwise.
   */
  private checkLeader():void {
    if (!this.fingerTable.getLeader() && !this.electionRunning) {
      this.consoleTable.log(chalk.bold.yellow("Calling Ellection!"));
      this.lock.acquire();
      this.timeStamp += 1;
      this.electionRunning = true;
      var entries = this.fingerTable.getEntriesWithGreaterId(this.id);
      this.lock.release();
      
      this.electionTimeOut = setTimeout(() => this.bully(), config.electionTimeout);
      if (entries.length > 0){
        this.communication.multicast(MessageFactory.EllectionMessage(this),entries);
      }
      if(entries.length == 0){
        clearTimeout(this.electionTimeOut);
        this.bully();
      }
        
      }
  }

  /**
   * Assign it self as a leader if there are no leader.
   */
  bully():void{
    this.lock.acquire();
    if(!this.fingerTable.getLeader()){
    this.consoleTable.log(chalk.bold.red("I Should be the Leader!"));
    this.leader = true;
    var entries2 = this.fingerTable.getEntriesWithSmallerId(this.id);
    this.communication.multicast(MessageFactory.CoordinatorMessage(this),entries2);
  }
  else{
    this.consoleTable.log(chalk.bold.blue("Ok there is another Leader"));
  }
    this.lock.release();
  }
}
