import { TypedEmitter } from 'tiny-typed-emitter';
import { Site, SiteI } from "./Site";
/**Event Interface
 * This is where all possible event types are defined.
 */
interface FingerTableEventsI {
    'failure': (el: SiteI) => void;
    'join': (el: SiteI) => void;
    'ready': () => void;
}
export interface FingerTableSiteI extends SiteI {
    clock: Date;
}
/**This class describes an entry in the finger table*/
export declare class FingerTableSite extends Site implements FingerTableSiteI {
    /**Clock on the local machine when this Site was last updated.*/
    clock: Date;
    state: string;
    lastFailure: Date;
    constructor(site: SiteI);
    updateTimeStamp(site: SiteI): void;
}
export interface FingerTableI {
    getEntries(): SiteI[];
    upsertEntry(SiteI: any): void;
    getEntryById(id: number): FingerTableSiteI;
    randomlyPickEntry(): FingerTableSiteI;
    getEntriesWithGreaterId(id: number): FingerTableSiteI[];
    getEntriesWithSmallerId(id: number): FingerTableSiteI[];
    getLeader(): (FingerTableSiteI | null);
}
/**Finger Table implementation */
export declare class FingerTable extends TypedEmitter<FingerTableEventsI> implements FingerTableI {
    /**Array of entries in the Finger table */
    private entries;
    private secconds;
    private lock;
    /**Constructor
     * @param seconds Number of seconds to declare a site failure.
     */
    constructor(seconds: number);
    /**Return all Entries in the Finger Table
     * @return Array of Entries
    */
    getEntries: () => SiteI[];
    /**Insert or update an entry in the finger table.
     *
     * If an entry with the same Id is already in the fingertable it compares the Lamport Time Stamp.
     * If the new TimeStamp is greater than it updates the entry with the new TimeStamp as well as the the new Local Date Time.
     *
     * @param {site} site  The Site to be updated or inserted
    */
    upsertEntry(site: SiteI): void;
    /**Remove Failured Entries from Finger Table
     *
     * After removing emmits an event ("failure") caring the list of failured entries.
    */
    removeFailuredEntries(): void;
    /**Return a Finger Table Entry based on the Id.
     * @param id Id to be searched.
     * @return Finger Table Entry with matching Id, if there is none than returns null.
    */
    getEntryById(id: number): (FingerTableSite | null);
    /**Return a Finger Table Entry based on the Id.
     * @param id Id to be searched.
     * @return Finger Table Entry with matching Id, if there is none than returns null.
    */
    removeEntryById(id: number): void;
    /**Randomly Pic a  */
    randomlyPickEntry(): (FingerTableSiteI | null);
    getEntriesWithSmallerId(id: number): FingerTableSiteI[];
    getEntriesWithGreaterId(id: number): FingerTableSiteI[];
    getLeader(): (FingerTableSiteI | null);
    setLeader(id: number): void;
}
export {};
