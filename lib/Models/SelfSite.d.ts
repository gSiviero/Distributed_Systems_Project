/// <reference types="node" />
import { Communication, CommunicationI } from "./Communication";
import { FingerTable, FingerTableI } from "./FingerTable";
import { Site, SiteI } from "./Site";
import { Mutex } from "async-mutex";
import { ConsoleTable } from "./Table";
export interface SelfSiteI extends SiteI {
    communication: CommunicationI;
    fingerTable: FingerTableI;
    toJson(): SiteI;
}
/** This implements a Local Site, where the fingertable and the communication capabilities are implemented.*/
export declare class SelfSite extends Site implements SelfSiteI {
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
    constructor(ip: string, port: number);
    private checkLeader;
}
