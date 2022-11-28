import { Base } from './Base';
export interface SiteI {
    ip: string;
    id: number;
    port: number;
    timeStamp: number;
    leader: boolean;
}
/**Definition of a generic Site. It does not implement communication or fingertable.
 * For the Local Site use the class SelfSite.
 */
export declare class Site extends Base implements SiteI {
    /**Site's ip */
    ip: string;
    /**Sites Id in the Ring */
    id: number;
    /**Port number this service is running on site */
    port: number;
    /**Lamport TimeStamp */
    timeStamp: number;
    /**Is this site leader? */
    leader: boolean;
    /**Communication Class, usedto receive and send messages accross the network */
    /** Instantiates a new Site.
     * @param ip Site's IP
     * @param port  Site's Port that the system is running
     */
    constructor(ip: string, port: number, id?: number, leader?: boolean);
    toJson: () => {
        ip: string;
        id: number;
        port: number;
        timeStamp: number;
        leader: boolean;
    };
}
