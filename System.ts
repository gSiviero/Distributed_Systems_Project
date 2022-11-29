import { Arguments } from "./Models/Arguments";
import { SelfSite } from "./Models/SelfSite";
import * as config from "./systemConfig.json";

var ip = require("ip");
const port = new Arguments("-p",config.port,process.argv);
const site = new SelfSite(ip.address(),port.value);
