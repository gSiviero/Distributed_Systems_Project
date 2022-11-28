import { Arguments } from "./Models/Arguments";
import { Client } from "./Models/Client";

const port = new Arguments("-p",8080,process.argv);
const site = new Client("localhost",port.value);
