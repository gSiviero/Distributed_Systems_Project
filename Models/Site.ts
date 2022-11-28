import {Md5} from 'ts-md5';
import { Base } from './Base';


export interface SiteI{
    ip:string;
    id:number;
    client:boolean;
    port:number;
    timeStamp:number;
    leader:boolean;
}


/**Definition of a generic Site. It does not implement communication or fingertable. 
 * For the Local Site use the class SelfSite.
 */
export class Site extends Base implements SiteI {
    /**Site's ip */
    ip:string;
    /**Sites Id in the Ring */
    id: number;
    /**Port number this service is running on site */
    port: number;
    /**Lamport TimeStamp */
    timeStamp:number;
    /**Is this site leader? */
    leader:boolean;

    client:boolean;
    /**Communication Class, usedto receive and send messages accross the network */
    
    /** Instantiates a new Site.
     * @param ip Site's IP
     * @param port  Site's Port that the system is running
     */
    constructor (ip:string,port:number,id?:number,leader?:boolean,client?:boolean){
        super();
        this.ip = ip;
        this.validateNotNull("ip");
        this.port = port;
        this.validateNotNull("port");
        this.validateObject();
        this.timeStamp = 0;
        this.leader = leader??false;
        this.client = client;
        this.id = id ?? (parseInt(Md5.hashStr(ip + port.toString()),16)%255);
    }
    
    toJson =()=>({ip:this.ip,id:this.id,port:this.port,timeStamp:this.timeStamp,leader:this.leader,client:this.client});
}
