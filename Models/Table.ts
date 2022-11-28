import { SelfSite, SelfSiteI } from "./SelfSite";
import * as chalk from 'chalk';
import * as blessed from "blessed";

/**Definition of a generic Site. It does not implement communication or fingertable. 
 * For the Local Site use the class SelfSite.
 */

export class ConsoleTable {
    screen: blessed.screen;
    infoBox:blessed.box;
    logsBox:blessed.log;
    fingerTableBox:blessed.box;
    constructor (){
        this.initiateScreen();
    }

    printFingerTable(site:SelfSite){
        var data = [[chalk.bold.red("SITE"),chalk.bold.red("TIMESTAMP"),chalk.bold.red("LEADER")]];
        data = data.concat(site.fingerTable.getEntries().map(e => {return [e.id.toString(),e.timeStamp.toString(), e.leader ? "X": ""]}));
        this.fingerTableBox.setData(data);

        this.infoBox.setContent(`ID:${chalk.yellow(site.id)}
IP:${chalk.yellow(site.ip)}
Port: ${chalk.blue(site.port)}
TimeStamp: ${chalk.blue(site.timeStamp)}
Leader:${chalk.bold.red(site.fingerTable.getLeader().id)}
Sites:${site.fingerTable.getEntries().length}`);
this.screen.render();
    }

    log(text:string){
        this.logsBox.log(`${new Date().toLocaleTimeString()}: ${text}`);
        this.screen.render();
    }

    initiateScreen(){
        this.screen = blessed.screen({
            smartCSR: true
          });
          
           this.screen.title = `Distributed DataBase`;
          
          // Create a box perfectly centered horizontally and vertically.
          this.infoBox = blessed.box({
            top: 'top',
            left: 'left',
            width: '30%',
            height: '70%',
            content: 'Initializing!',
            tags: true,
            border: {
              type: 'line'
            },
            style: {
              fg: 'white',
              border: {
                fg: '#f0f0f0'
              }
            }
          });

          this.logsBox = blessed.log({
            bottom: '0',
            left: '0',
            width: '100%',
            height: '30%',
            tags: true,
            border: {
              type: 'line',
            },
            style: {
              fg: 'green',
            }
          });

          this.fingerTableBox = blessed.table({
            top: '0',
            right: '0',
            width: '70%',
            height: '70%',
            tags: true,
            border: {
              type: 'line',
              fg: 'red'
            },
            style: {
              fg: 'green',
              header:{fg:'red'}
            }
          });

          // Append our box to the screen.
          this.screen.append(this.infoBox);
          this.screen.append(this.logsBox);
          this.screen.append(this.fingerTableBox);

          // Quit on Escape, q, or Control-C.
          this.screen.key(['escape', 'q', 'C-c'], function(ch, key) {
            return process.exit(0);
          });
          
          // Focus our element.
          this.infoBox.focus();
          this.screen.render();
          
        setInterval(() => this.infoBox.setContent(`${new Date().toTimeString()}: TESTE`),1000);
    }

}
