// Chat app MQTT settings
var mqttServer = "ws://broker.hivemq.com:8000/mqtt";
var mqttTopic= "codettes2022";
var userName = "Keshav";
const clientId = 'cb22_' + Math.random().toString(16).substr(2, 8)
var userList = [];

const opts = {
  keepalive: 30,
  clientId: clientId,
  protocolId: 'MQTT',
  protocolVersion: 4,
  clean: true,
  reconnectPeriod: 1000,
  connectTimeout: 30 * 1000,
  will: {
    topic: 'WillMsg',
    payload: 'Connection Closed abnormally..!',
    qos: 0,
    retain: false
  },
  rejectUnauthorized: false
}

console.log('connecting mqtt client')
const client = mqtt.connect(mqttServer, opts);

client.on('error', function (err) {
  console.log(err)
  client.end()
})

client.on('connect', function () {
  // Once a connection has been made, make a subscription and send a message.
  console.log('client connected:' + clientId)
  client.subscribe(mqttTopic, { qos: 0 })
  client.publish(mqttTopic, userName + " signed on!", { qos: 0, retain: false })
  sendPong();
})

client.on('message', function (topic, message, packet) {
  msg = message.toString(); // library delivers  buffer so convert to strig first
  console.log("onMessageArrived: "+ msg);
  // if it has JSON payload do NOT add to chat
  try{
    msgObj = JSON.parse(message.toString()); // t is JSON so handle it how u want
    // if message has Pin of Pong in it send it to the PingPongHandler
    if (Object.keys(msgObj)[0] == "ping"){sendPong();};
    if (Object.keys(msgObj)[0] == "pong"){handlePong(msgObj.pong);}; // pong value is an object!!
    // other handlers for control messages below

  }catch {
    document.getElementById("chatlog").innerHTML += "<br> >> " + msg;
  }
})

client.on('close', function () {
  console.log(clientId + ' disconnected')
})

function sendMessageButton(msgtext){
    if (msgtext!=''){
        client.publish(mqttTopic, userName + " says: " + msgtext);
    }
}

// OR listen to the Enter event on n input box
function sendMsg(ele) {
    if(event.key === 'Enter') {
        client.publish(mqttTopic, userName + " says: " + ele.value);
        //alert(ele.value);
        ele.value = ""; // reset the input after entering
    }
}

// --- To manage userlist implement a PING and PONG system ---
// Ping will request an "alive sign" from all or any user
// Pong function will respond to ping
// handlePong pongs in the UI
// Ping will be scheduled to run regularly as a KeepAlive signal

function sendPing(usr='*'){
    // ping sends out a message to all (*) or any specific user to respond if ur there
    var pingObj={ping:usr};
    client.publish(mqttTopic, JSON.stringify(pingObj));
}

function sendPong(){
    // sends clientID and UserName in a JSON object (and whatever u need more)
    var pongObj={pong :{userName : userName, clientId:clientId}};
    client.publish(mqttTopic, JSON.stringify(pongObj));
    console.log(JSON.stringify(pongObj));
}

// function that manages the UserList and other UI stuff related to PingPong
function handlePong(pongObj){
    // Update Userlist with Pongs
    const index = userList.findIndex(object => {
      return object.userName === pongObj.userName;
    });

    //console.log("index:" + index);
    if(index>=0){
        console.log("User exists");
        userList[index] = pongObj;
    } else{
        console.log("New User " + pongObj.userName);
        userList.push(pongObj);
    }
    //console.log(userList);
    redrawUserList();
}

function redrawUserList(){
    // Generate the userlist HTML
    var ulist="<ul>";
    userList.forEach(function (item) {
        //var x = arrayItem.prop1 + 2;
        ulist+= "<li>"+ item.userName + " <a href='#" + mqttTopic + "/" + item.clientId +"'><i class='fa fa-fw fa-phone'></i></a></li>"
    });
    ulist+="</ul>";
    //console.log(ulist);
    document.getElementById("userlist").innerHTML=ulist;
}
// to keep connection alive
//setInterval(sendPong, 10000); // keeps ponging every 10 secs