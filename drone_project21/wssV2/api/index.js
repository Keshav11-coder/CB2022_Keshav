const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3000 });
const clients = new Map();
const tello = require('./i'); // library > mix of npm package and my ideas

const CNTDRN = false; // true for flight; false for testing

if (CNTDRN == true) {
  tello.setHost('192.168.10.1'); // OPTIONAL: (default host : 192.168.10.1)
  tello.setPort('8889'); // OPTIONAL: (default port : 8889)

  tello.connect();
} else {
  console.log("enter debug mode");
}

tello.help(); // OPTIONAL: display help menu on start, uncomment if needed

function handleMsg(message) { // handle messages and move drone based on them
  msg = message.kp;

  if (msg.includes("e")) {
    console.log("tkf")
    tello.takeoff();
  } else {
    /**/
  }
  if (msg.includes("q")) {
    console.log("lnd")
    tello.land();
  } else {
    /**/
  }

  if (msg.includes("w")) {
    console.log("frwrd")
    var f = true;
  } else {
    var f = false;
  }
  if (msg.includes("s")) {
    console.log("bkwrd")
    var b = true;
  } else {
    var b = false;
  }
  if (msg.includes("a")) {
    console.log("lt")
    var l = true
  } else {
    var l = false;
  }
  if (msg.includes("d")) {
    console.log("rt")
    var r = true;
  } else {
    var r = false;
  }

  if (f == true && CNTDRN == true) {
    tello.forward(10);
  }
  else if (b == true && CNTDRN == true) {
    tello.back(10);
  }
  else if (l == true && CNTDRN == true) {
    tello.left(10);
  }
  else if (r == true && CNTDRN == true) {
    tello.right(10);
  } else {
    /**/
  }

}

wss.on('connection', (ws) => { // on connection callback, message callback (we call handle message here)
  const id = uuidv4();
  const color = Math.floor(Math.random() * 360);
  const metadata = { id, color };

  clients.set(ws, metadata);

  ws.on('message', (messageAsString) => {
    var message = JSON.parse(messageAsString);
    var metadata = clients.get(ws);
    message.sender = metadata.id;
    message.color = metadata.color;

    if (CNTDRN == false) {
      console.log(message.kp);
    }

    handleMsg(message);

    [...clients.keys()].forEach((client) => {
      client.send(JSON.stringify(message));
    });
  });
});

wss.on("close", () => { // on close delete all the clients and close websocket
  clients.delete(ws);
});

function uuidv4() { // generate unique ID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

console.log("wss up"); // startup message