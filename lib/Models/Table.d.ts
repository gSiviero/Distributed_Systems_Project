import { SelfSite } from "./SelfSite";
import * as Table from "cli-table";
/**Definition of a generic Site. It does not implement communication or fingertable.
 * For the Local Site use the class SelfSite.
 */
export declare class ConsoleTable {
    table: Table;
    constructor();
    printFingerTable(site: SelfSite): void;
    underScore(text: any, yes: boolean): any;
}
