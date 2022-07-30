var ip = require('ip');

var PORT = 8889;
var HOST = '192.168.10.1';

exports.setHost = function setHost(host) {
    HOST = host;
}

exports.setPort = function setHost(port) {
    PORT = parseInt(port);
}
var dgram = require('dgram');
var client = dgram.createSocket('udp4');

client.on('message', function (message) {
    console.log(message.toString());
    //console.log(message.toString());
});

exports.help = function help(func) {
    var listfunc = ["tello.connect()", "tello.takeoff()", "tello.land()", "tello.left()", "tello.right()", "tello.forward()", "tello.backward()", "tello.rtClockwise", "tello.rtCntrClockwise", "tello.battery()"]

    if (func == null || !listfunc.indexOf(func)) {
        console.log("||| welcome to the help menu |||")
        console.log("9 current functions: ")
        console.log("tello.connect(): connects to the tello drone, no inputs required")
        console.log("tello.takeoff(): lifts the drone up in the air, no inputs reqired")
        console.log("tello.land(): lands the drone slowly, no inputs required")
        console.log("tello.left(x): moves the drone x cm left, input required(x = cm => between 20-500)")
        console.log("tello.right(x): moves the drone x cm right, input required(x = cm => between 20-500)")
        console.log("tello.forward(x): moves the drone x cm forward, input required(x = cm => between 20-500) ")
        console.log("tello.backward(x): moves the drone x cm backward, input required(x = cm => between 20-500) ")
        console.log("tello.rtClockwise(degrees): rotates the drone in the clockwise direction(x degrees), input required(x = [degrees] => between 0-360)")
        console.log("tello.rtCntrClockwise(degrees): rotates the drone in the counterclockwise direction(x degrees), input required(x = [degrees] => between 0-360)")
    } else {
        console.log("WORK IN PROGRESS, PLEASE CALL HELP LIKE tello.help();");
    }
}

exports.connect = function connect() {
    console.log('[📡] Current connection to DJI Tello at ip ' + HOST + ':' + PORT);
    console.log('[📡] Connected to Tello');

    var message = new Buffer.alloc('command');
    client.send(message, 0, message.length, PORT, HOST, function (err, bytes) {
        if (err) throw err;
        console.log('[🎮] You are now fully taking control of the Tello Drone');
        console.log("[🎮] Go to http://localhost:5500 to control the Tello'");
    });
}

exports.takeoff = function takeoff() {
    var message = new Buffer.alloc('takeoff');
    client.send(message, 0, message.length, PORT, HOST, function (err, bytes) {
        if (err) throw err;
        console.log('[✈] Take Off');
    });
}

exports.land = function land() {
    var message = new Buffer.alloc('land');
    client.send(message, 0, message.length, PORT, HOST, function (err, bytes) {
        if (err) throw err;
        console.log('[✈] Land');
    });
}

exports.left = function left(x) {
    var message = new Buffer.alloc('left ' + x);
    client.send(message, 0, message.length, PORT, HOST, function (err, bytes) {
        if (err) throw err;
        console.log('[✈][🎮] Left ' + x);
    });
}

exports.right = function right(x) {
    var message = new Buffer.alloc('right ' + x);
    client.send(message, 0, message.length, PORT, HOST, function (err, bytes) {
        if (err) throw err;
        console.log('[✈][🎮] Right ' + x);
    });
}

exports.backwards = function back(x) {
    var message = new Buffer.alloc('back ' + x);
    client.send(message, 0, message.length, PORT, HOST, function (err, bytes) {
        if (err) throw err;
        console.log('[✈][🎮] Backwards ' + x);
    });
}

exports.forward = function forward(x) {
    var message = new Buffer.alloc('forward ' + x);
    client.send(message, 0, message.length, PORT, HOST, function (err, bytes) {
        if (err) throw err;
        console.log('[✈][🎮] Forward ' + x);
    });
}

exports.event = function event(e) {
    e = e.toString();
    var message = new Buffer.alloc(e);
    client.send(message, 0, message.length, PORT, HOST, function (err, bytes) {
        if (err) throw err;
        console.log('[*] Execute command : ' + e);
    });
}

exports.battery = function battery() {
    var message = new Buffer.alloc('battery?');
    client.send(message, 0, message.length, PORT, HOST, function (err, bytes) {
        if (err) throw err;
        console.log('[*] Receive Battery');
    });
}

exports.rtClockwise = function rtClockwise(deg) {
    var message = new Buffer.alloc('cw ' + deg);
    client.send(message, 0, message.length, PORT, HOST, function (err, bytes) {
        if (err) throw err;
        console.log('[*] rotate clockwise');
    });
}

exports.rtCntrClockwise = function rtCntrClockwise(deg) {
    var message = new Buffer.alloc('ccw ' + deg);
    client.send(message, 0, message.length, PORT, HOST, function (err, bytes) {
        if (err) throw err;
        console.log('[*] rotate counterclockwise');
    });
}