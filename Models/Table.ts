import { SelfSite, SelfSiteI } from "./SelfSite";
import * as chalk from "chalk";
import * as blessed from "blessed";

/**Definition of a generic Site. It does not implement communication or fingertable.
 * For the Local Site use the class SelfSite.
 */

export class ConsoleTable {
  screen: blessed.screen;
  infoBox: blessed.box;
  logsBox: blessed.log;
  fingerTableBox: blessed.box;
  terminal: blessed.form;
  constructor() {
    this.initiateScreen();
  }

  printFingerTable(site: SelfSite) {
    var data = [
      [
        chalk.bold.red("SITE"),
        chalk.bold.red("TIMESTAMP"),
        chalk.bold.red("LEADER"),
        chalk.bold.red("CLIENT"),
      ],
    ];
    data = data.concat(
      site.fingerTable.getEntries().map((e) => {
        return [e.id.toString(), e.timeStamp.toString(), e.leader ? "X" : "", e.client ? "X": ""];
      })
    );
    this.fingerTableBox.setData(data);

    var info = `ID:${chalk.yellow(site.id)} \n`;
    info += `IP:${chalk.yellow(site.ip)} \n`;
    info += `Port: ${chalk.blue(site.port)} \n`;
    info += `TimeStamp: ${chalk.blue(site.timeStamp)} \n`;
    info += `Leader:${chalk.bold.red(site.fingerTable.getLeader().id)}\n`;
    info += `Sites:${site.fingerTable.getEntries().length}\n`;

    this.infoBox.setContent(info);
    this.screen.render();
  }

  log(text: string) {
    this.logsBox.log(`${new Date().toLocaleTimeString()}: ${text}`);
    this.screen.render();
  }

  initiateScreen() {
    this.screen = blessed.screen({
      smartCSR: true,
      fullUnicode: true,
      dockBorders: true,
      ignoreDockContrast: true,
    });

    this.screen.title = `Distributed DataBase`;

    // Create a box perfectly centered horizontally and vertically.
    this.infoBox = blessed.box(infoBoxConfig);
    this.logsBox = blessed.log(logBoxConfig);
    this.fingerTableBox = blessed.table(fingerTableConfig);

    this.screen.append(this.infoBox);
    this.screen.append(this.logsBox);
    this.screen.append(this.fingerTableBox);
    // Quit on Escape, q, or Control-C.
    this.screen.key(["escape", "q", "C-c"], function (ch, key) {
      return process.exit(0);
    });
    this.screen.render();
  }
}



var fingerTableConfig = {
    top: "0",
    right: "0",
    width: "70%",
    height: "70%",
    tags: true,
    border: {
      type: "line",
      fg: "red",
    },
    style: {
      fg: "green",
      header: { fg: "red" },
    },
  }

  var logBoxConfig = {
    bottom: "0",
    left: "0",
    width: "100%",
    height: "30%",
    tags: true,
    border: {
      type: "line",
    },
    style: {
      fg: "green",
    },
  }

  var infoBoxConfig = {
    top: "top",
    left: "left",
    width: "30%",
    height: "70%",
    content: "Initializing!",
    tags: true,
    border: {
      type: "line",
    },
    style: {
      fg: "white",
      border: {
        fg: "#f0f0f0",
      },
    },
  };
