import { Md5 } from "ts-md5";
import { SelfSiteI } from "./SelfSite";
import { SiteI } from "./Site";

/**Declaration of Message */
export interface MessageI{
    /**Hash that works as an Id for the message */
    hash:string;
    /**Sender Site */
    sender:SiteI;
    /**Topic that identifyes the type of message */
    topic: string;
    /**Payload, to later be converted into a Json Object */
    payload:string;
    gossip:boolean;
}

/**Implementation of Message */
class Message implements MessageI{
    hash: string;
    sender: SiteI;
    topic: string;
    payload: string;
    gossip:boolean;
    
    /**
     * 
     * @param sender Site who originated the Message
     * @param topic Topic that identifies the type of message
     * @param payload Actual Payload.
     */
    constructor(sender:SiteI,topic:string,payload:string,gossip?:boolean){
        this.sender = sender;
        this.topic = topic;
        this.payload = payload;
        this.hash = Md5.hashStr(JSON.stringify(this));
        this.gossip = gossip??false;
    }
}


export class  MessageFactory{
    static HeartBeatMessage (sender:SelfSiteI):MessageI{
        return new Message(sender.toJson(),"heartBeat",JSON.stringify(sender.fingerTable.getEntries()),true);
    }

    static FailureDetected (sender:SelfSiteI,failureId:number):MessageI{
        return new Message(sender.toJson(),"failure",failureId.toString(),true);
    }

    static EllectionMessage (sender:SelfSiteI):MessageI{
        return new Message(sender.toJson(),"election",null);
    }

    static CoordinatorMessage (sender:SelfSiteI):MessageI{
        return new Message(sender.toJson(),"coordinator",null);
    }

    static QueryMessage (sender:SelfSiteI,query:string):MessageI{
        return new Message(sender,"query",query);
    }
    static QueryResultMessage (sender:SelfSiteI,query:string):MessageI{
        return new Message(sender.toJson(),"queryResult",query);
    }

    static RestoreDBMessage (sender:SelfSiteI,db:string):MessageI{
        return new Message(sender.toJson(),"restoreDB",db);
    }
}
