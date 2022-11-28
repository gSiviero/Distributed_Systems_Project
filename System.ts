import { Arguments } from "./Models/Arguments";
import { SelfSite } from "./Models/SelfSite";
var ip = require("ip");
const port = new Arguments("-p",8080,process.argv);
const site = new SelfSite(ip.address(),port.value);
