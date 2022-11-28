import { SelfSiteI } from "./SelfSite";
import { SiteI } from "./Site";
/**Declaration of Message */
export interface MessageI {
    /**Hash that works as an Id for the message */
    hash: string;
    /**Sender Site */
    sender: SiteI;
    /**Topic that identifyes the type of message */
    topic: string;
    /**Payload, to later be converted into a Json Object */
    payload: string;
}
export declare class MessageFactory {
    static HeartBeatMessage(sender: SelfSiteI): MessageI;
    static FailureDetected(sender: SelfSiteI, failureId: number): MessageI;
    static EllectionMessage(sender: SelfSiteI): MessageI;
    static CoordinatorMessage(sender: SelfSiteI): MessageI;
}
