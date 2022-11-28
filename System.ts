import { Arguments } from "./Models/Arguments";
import { SelfSite } from "./Models/SelfSite";

const port = new Arguments("-p",8080,process.argv);
const site = new SelfSite("localhost",port.value);
