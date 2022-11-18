
// var events = require('events');

// exports.UDPUtils = class UDPUtils extends events.EventEmitter{
//   constructor(object) {
//     super();
//     var self = this;
//     this.listen = object.listen;
//     this.broadcast = object.broadcast;
//     var dgram = require("dgram");
//     var server = dgram.createSocket("udp4");

//     server.bind(() => server.setBroadcast(true));
//     var client = dgram.createSocket("udp4");
//     client.bind(this.listen);
//     client.on("listening", () => 
//       console.log("UDP Client listening on " + object.listen)
//     );

//     this.client = client;
//     this.server = server;

//     this.client.on("listening", function () {
//       client.setBroadcast(true);
//     });

//     this.client.on("message", function (message, rinfo) {
//       var msg = JSON.parse(message);
//       console.log(`${msg.sender} - ${msg.timeStamp} : ${msg.topic}`);
//       self.emit(msg.topic,msg.payload);
//     });
//   }

//   UDPbroadCast(text) {
//     var BROADCAST_ADDR = "255.255.255.255";
//     var message = Buffer.from(text);
//     this.broadcast.forEach((port) => {
//       this.server.send(message, 0, message.length, port, BROADCAST_ADDR);
//     });
//   }
// };
