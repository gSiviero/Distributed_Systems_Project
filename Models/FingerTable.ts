import { Base } from "./Base";
import { SiteI } from "./Site";
import { TypedEmitter } from 'tiny-typed-emitter';

/**Event Interface
 * This is where all possible event types are defined.
 */
interface FingerTableEventsI {
    'failure': (el:SiteI[]) => void;
    'ready': () => void;
  }

/**This class describes an entry in the finger table*/
export class FingerTableSite extends Base implements SiteI {
    /**Ip of the site */
    ip: string;
    /**Identification of the site in the ring*/
    id: string;
    /**Port that this site is running*/
    port: number;
    /**Lamport Timestamp of a given site*/
    timeStamp: number;
    /**Clock on the local machine when this Site was last updated.*/
    clock:Date;
    constructor(site:SiteI){
        super();
        this.id = site.id;
        this.validateNotNull("id");
        this.ip = site.ip;
        this.validateNotNull("ip");
        this.port = site.port;
        this.validateNotNull("port");
        this.timeStamp = site.timeStamp;
        this.clock = new Date();
        this.validateObject();
    }
    
}

/**Finger Table implementation */
export class FingerTable extends TypedEmitter<FingerTableEventsI>{
    /**Array of entries in the Finger table */
    private entries:FingerTableSite[];
    /**Constructor
     * @param seconds Number of seconds to declare a site death.
     */
    constructor(seconds:number){
        super();
        this.entries = [];
        setInterval(this.checkEntries,seconds*1000);
    }

    /**Return all Entries in the Finger Table
     * @return Array of Entries
    */
    getEntries = ():FingerTableSite[] => this.entries;

    /**Insert or update an entry in the finger table.
     * 
     * If an entry with the same Id is already in the fingertable it compares the Lamport Time Stamp.
     * If the new TimeStamp is greater than it updates the entry with the new TimeStamp as well as the the new Local Date Time.
     * 
     * @param {site} site  The Site to be updated or inserted
    */
    upsertEntry(site:SiteI){
        var entry = this.getEntryById(site.id);
        if(entry == null)
            this.entries.push(new FingerTableSite(site));
        else if(site.timeStamp > entry.timeStamp)
            entry = new FingerTableSite(site);
    }

    /**Private method that check for failured entries
     * 
     * Return a list of entries that were not updated in the last "secconds" secconds.
     * @return List of Entries
    */
    private checkEntries():(FingerTableSite[] | null){
        var now  = new Date();
        now.setSeconds(now.getSeconds() - 1);
        var entries = this.entries.filter((e) => e.clock.getTime() < now.getTime());
        return entries;
    }

    /**Remove Failured Entries from Finger Table
     * 
     * After removing emmits an event ("failure") caring the list of failured entries.
    */
    removeFailuredEntries():void{
        var entriesToBeRemoved =  this.checkEntries();
        var idsToRemove = entriesToBeRemoved.map((e) => e.id);
        this.entries = this.entries.filter((e) => idsToRemove.indexOf(e.id) != -1 );
        this.emit("failure",entriesToBeRemoved);
    }

    /**Return a Finger Table Entry based on the Id.
     * @param id Id to be searched.
     * @return Finger Table Entry with matching Id, if there is none than returns null.
    */
    getEntryById(id:string):(FingerTableSite | null){
        var entries = this.entries.filter((e) => e.id == id);
        return entries.length > 0 ? entries[0] : null;
    }

    
}
