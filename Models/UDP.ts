import * as dgram from 'dgram' ;
import { MessageI } from './Communication';
import { TypedEmitter } from 'tiny-typed-emitter';
import { SiteI } from './Site';

export interface UDPI{
  broadcast(message:MessageI):void;
  'listening': () => void;
  'message':(message:MessageI) => void;
}

export class UDP extends TypedEmitter<UDPI>{
    private client:any;
    possiblePorts: number[]
    /**
     * Instantiates a new UDP service.
     * @param serverPort Listen on this port for connections
     * @param possiblePorts Possible ports for nodes to operate
     */
    constructor(serverPort:number,possiblePorts:number[]){
      super();
      this.possiblePorts = possiblePorts;
      const server = dgram.createSocket("udp4");
      server.bind(serverPort, () => server.setBroadcast(true));
      server.on("listening",() => {
        this.emit("listening");
      });
      server.on("message",(d:MessageI) => {
        this.emit("message",d);
      });
      this.client = dgram.createSocket("udp4");
    }

    /**Broadcast to all IPs in the network listening on all Ports defined in this.possiblePorts */
    broadCast(message:MessageI){
      this.possiblePorts.forEach((port) =>{
        console.log(`BroadCasting ${port}`);
        this.client.send(Buffer.from(JSON.stringify(message)),port,'localhost');
      });
    }

}
