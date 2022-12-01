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
    timeStamps?:any;
}

/**Implementation of Message */
class Message implements MessageI{
    hash: string;
    timeStamps:any;
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
        this.timeStamps = {"a":10};
    }
}

/**
 * Message Factory, generates all different possible messages in the System.
 */
export class  MessageFactory{
    /**
     * Creates a HeartBeat message
     * @param sender Site Sending the message
     * @returns 
     */
    static HeartBeatMessage (sender:SelfSiteI):MessageI{
        var msg = new Message(sender.toJson(),"heartBeat",JSON.stringify(sender.fingerTable.getEntries()),true);
        sender.fingerTable.getEntries().forEach((e) => msg.timeStamps[e.id] =e.timeStamp );
        return msg
    }

    /**
     * Creates a Failure Detection Message
     * @param sender Site sending the message
     * @param failureId Id of the Site that failed
     * @returns 
     */
    static FailureDetected (sender:SelfSiteI,failureId:number):MessageI{
        var msg = new Message(sender.toJson(),"failure",failureId.toString(),true);
        sender.fingerTable.getEntries().forEach((e) => msg.timeStamps[e.id] =e.timeStamp );  
        return msg;
    }


    /**
     * Creates a Election Detection Message
     * @param sender Site sending the message
     * @returns 
     */
    static EllectionMessage (sender:SelfSiteI):MessageI{
        var msg =  new Message(sender.toJson(),"election",null);
        sender.fingerTable.getEntries().forEach((e) => msg.timeStamps[e.id] =e.timeStamp );    
        return msg;
    }

    /**
     * Creates a Coordinator Detection Message
     * @param sender Site sending the message
     * @returns 
     */
    static CoordinatorMessage (sender:SelfSiteI):MessageI{
        var msg =  new Message(sender.toJson(),"coordinator",null);
        sender.fingerTable.getEntries().forEach((e) => msg.timeStamps[e.id] =e.timeStamp );    
        return msg;
    }

    /**
     * Creates a Query Detection Message
     * @param sender Site sending the message
     * @param query Query been sent
     * @returns 
     */
    static QueryMessage (sender:SelfSiteI,query:string):MessageI{
        var msg =  new Message(sender.toJson(),"query",query);
        sender.fingerTable.getEntries().forEach((e) => msg.timeStamps[e.id] =e.timeStamp );   
        return msg;
    }

    /**
     * Creates a Restore DB message
     * @param sender Site sending the message
     * @param db String containing the DB data
     * @returns 
     */
    static RestoreDBMessage (sender:SelfSiteI,db:string):MessageI{
        var msg =  new Message(sender.toJson(),"restoreDB",db);
        sender.fingerTable.getEntries().forEach((e) => msg.timeStamps[e.id] =e.timeStamp );      
        return msg;
    }
}
