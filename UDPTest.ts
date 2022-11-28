import { UDP } from "./Models/UDP";

var udp = new UDP(2000,[2000]);

udp.on("message",(m) => console.log(`${(new Date()).toLocaleTimeString()} : ${m.name}`));

setInterval(() => {udp.broadCast({name:"Brazil"});},1000);

