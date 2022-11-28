import { UDP } from "./Models/UDP";

var udp = new UDP(8080,[8080]);

udp.on("message",(m) => console.log(`${(new Date()).toLocaleTimeString()} : ${m.name}`));

setInterval(() => {udp.broadCast({name:"Brazil"});},1000);

