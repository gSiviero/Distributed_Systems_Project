import { Communication } from "./Communication";
import readline from 'readline-promise';
import { FingerTable } from "./FingerTable";
import { MessageFactory, MessageI } from "./Message";
import * as chalk from "chalk";
import { Arguments } from "./Arguments";
import { Site } from "./Site";
import * as config from "../systemConfig.json";

/** This implements a Local Site, where the fingertable and the communication capabilities are implemented.*/
export class Client extends Site{
  /**Fingertable Manager, it keeps track of other sites in the network.*/
  fingerTable: FingerTable;
  /**Communication implementation, this is an abstraction of the possible communication methods.*/
  communication: Communication;

  cli:any;
  /**
   *
   * @param ip Local Site's IP.
   * @param port Local Sites Port;
   */
  constructor(ip: string, port: number) {
    super(ip,port,null,null,true);
    this.fingerTable = new FingerTable(3);
    this.communication = new Communication(port,config.possiblePorts);

    setInterval(() =>{
        this.timeStamp += 1;
        this.communication.broadcast(MessageFactory.HeartBeatMessage(this));
    },100)

    this.communication.on("heartBeat", (s) => {
        this.fingerTable.upsertEntry(s.sender);
      });

    this.cli = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: true
      });

      this.prompt();

    this.communication.on("queryResult", (m) => {
      console.log(`[${chalk.yellow(m.sender.id.toString())}]: ${m.payload}`);
      this.prompt();
    });  
    
    
    this.communication.on("gossip",(m) =>{ this.gossip(m) });
  }

  prompt(){
    this.cli.questionAsync(chalk.green('Query:  ')).then(answer => {
        if(answer == "clear"){
            console.clear();
            this.prompt();
        }
        else{
            this.communication.query(MessageFactory.QueryMessage(this,answer),this.fingerTable.getLeader());
        }
  });}

  
  private gossip(message: MessageI) {
    message.gossip=true;
    var destination = this.fingerTable.randomlyPickEntry(this,message.sender);
    if(destination)
      this.communication.unicast(message,destination );
  }
}
