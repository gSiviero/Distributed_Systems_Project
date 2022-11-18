import {Md5} from 'ts-md5';
import { Base } from './Base';
import { FingerTable } from './FingerTable';


export interface SiteI{
    ip:string;
    id:string;
    port:number;
    timeStamp:number;
}
/**Definition of a Site */
export class Site extends Base implements SiteI {
    /**Site's ip */
    ip:string;
    /**Sites Id in the Ring */
    id: string;
    /**Port number this service is running on site */
    port: number;
    /**Lamport TimeStamp */
    timeStamp:number;
    /**Is this site leader? */
    leader:false;
    
    constructor (ip:string,port:number){
        super();
        this.ip = ip;
        this.validateNotNull("ip");
        this.port = port;
        this.validateNotNull("port");
        this.validateObject();
        this.timeStamp = 0;
        this.id = Md5.hashStr(ip + port.toString()).slice(-2);
    }
}

export class SelfSite extends Site{
    fingerTable:FingerTable;
    constructor(ip:string,port:number){
        super(ip,port);
        this.fingerTable = new FingerTable(1);
    }
}