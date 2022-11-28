import { TypedEmitter } from 'tiny-typed-emitter';
import { Site, SiteI } from "./Site";
import {Mutex, MutexInterface, Semaphore, SemaphoreInterface, withTimeout} from 'async-mutex';

/**Event Interface
 * This is where all possible event types are defined.
 */
interface FingerTableEventsI {
    'failure': (el:SiteI) => void;
    'join': (el:SiteI) => void;
    'ready': () => void;
  }

export interface FingerTableSiteI extends SiteI{
    clock:Date;
}
/**This class describes an entry in the finger table*/
export class FingerTableSite extends Site  implements FingerTableSiteI {
    /**Clock on the local machine when this Site was last updated.*/
    clock:Date;
    state:string;
    lastFailure:Date;
    constructor(site:SiteI){
        super(site.ip,site.port,site.id,site.leader);
        this.timeStamp = site.timeStamp;
        this.clock = new Date();
    }
    
    updateTimeStamp(site:SiteI){
        this.timeStamp = site.timeStamp;
        this.leader = site.leader;
        this.clock = new Date();
    }
}

export interface FingerTableI{
    getEntries():SiteI[];
    upsertEntry(SiteI):void;
    getEntryById(id:number):FingerTableSiteI;
    randomlyPickEntry():FingerTableSiteI;
    getEntriesWithGreaterId(id:number):FingerTableSiteI[];
    getEntriesWithSmallerId(id:number):FingerTableSiteI[];
    getLeader():(FingerTableSiteI | null);
}
/**Finger Table implementation */
export class FingerTable extends TypedEmitter<FingerTableEventsI> implements FingerTableI{
    /**Array of entries in the Finger table */
    private entries:FingerTableSite[];
    private secconds:number;
    private lock:Mutex;
    /**Constructor
     * @param seconds Number of seconds to declare a site failure.
     */
    constructor(seconds:number){
        super();
        this.secconds = seconds;
        this.entries = [];
        this.lock = new Mutex();
        setInterval(() => {
            this.removeFailuredEntries();
        },seconds * 1000);
    }

    /**Return all Entries in the Finger Table
     * @return Array of Entries
    */
    getEntries = ():SiteI[] => this.entries.map((e) =>  e.toJson());

    /**Insert or update an entry in the finger table.
     * 
     * If an entry with the same Id is already in the fingertable it compares the Lamport Time Stamp.
     * If the new TimeStamp is greater than it updates the entry with the new TimeStamp as well as the the new Local Date Time.
     * 
     * @param {site} site  The Site to be updated or inserted
    */
    upsertEntry(site:SiteI):void{
        this.lock.acquire();
        var entry = this.getEntryById(site.id);
        if(entry == null){
            entry = new FingerTableSite(site);
            this.entries.push(entry);
            if(entry.timeStamp == 1)
                this.emit("join",entry);
        }
        else if(site.timeStamp > entry.timeStamp){
            entry.updateTimeStamp(site);
        }
        this.sort();
        this.lock.release();
    }

    sort = () => this.entries.sort((a,b) => a.id - b.id);

    /**Remove Failured Entries from Finger Table
     * 
     * After removing emmits an event ("failure") caring the list of failured entries.
    */
    removeFailuredEntries():void{
        this.lock.acquire();
        var timeCut = new Date();
        timeCut.setSeconds(timeCut.getSeconds() - this.secconds);
        var listOfFailures = this.entries.filter((e) => e.clock < timeCut);
        this.entries = this.entries.filter((e) => e.clock > timeCut);
        if(listOfFailures.length > 0){
            listOfFailures.forEach((s) => this.emit("failure", s));
        }
        this.sort();
        this.lock.release();
    }

    /**Return a Finger Table Entry based on the Id.
     * @param id Id to be searched.
     * @return Finger Table Entry with matching Id, if there is none than returns null.
    */
    getEntryById(id:number):(FingerTableSite | null){
        var entries = this.entries.filter((e) => e.id == id);
        return entries.length > 0 ? entries[0] : null;
    }

    /**Return a Finger Table Entry based on the Id.
     * @param id Id to be searched.
     * @return Finger Table Entry with matching Id, if there is none than returns null.
    */
     removeEntryById(id:number){
        this.lock.acquire();
        this.entries = this.entries.filter((e) => e.id != id);
        this.lock.release();
    }

    /**Randomly Pic a  */
    randomlyPickEntry(): (FingerTableSiteI | null){
        var index = Math.floor(Math.random() *this.entries.length);
        return this.entries[index];
    }

    getEntriesWithSmallerId(id:number): FingerTableSiteI[]{
        return this.entries.filter((n) => id  > n.id);
    }
    
    getEntriesWithGreaterId(id:number): FingerTableSiteI[]{
        return this.entries.filter((n) => id < n.id);
    }

    getLeader(): (FingerTableSiteI | null){
        var entries = this.entries.filter((n) => n.leader == true);
        return entries.length > 0 ? entries[0] : null;
    }

    setLeader(site:SiteI){
        this.entries.forEach((e) => {
            e.leader = site.id == e.id;
        })
    }

    
}