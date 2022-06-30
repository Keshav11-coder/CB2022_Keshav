
// Create a client instance
//client = new Paho.MQTT.Client("test.mosquitto.org", 8080, client_id="", clean_session="true", userdata="none", protocol="MQTTv311", transport="tcp");

var client = new Paho.MQTT.Client("broker.hivemq.com", 8000, "Keshav");

// set callback handlers
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

// connect the client
client.connect({onSuccess:onConnect});


// called when the client connects
function onConnect() {
  // Once a connection has been made, make a subscription and send a message.
  console.log("onConnect");
  client.subscribe("codettes2022");
  //pick one!
  message = new Paho.MQTT.Message("Keshav just hopped on! say hi!");
  message2 = new Paho.MQTT.Message("Keshav just landed! say hello!");
  message3 = new Paho.MQTT.Message("Keshav joined the party! welcome!");
  message4 = new Paho.MQTT.Message("welcome keshav, we hope you brought boogie's");
  message.destinationName = "codettes2022";
  message2.destinationName = "codettes2022";
  message3.destinationName = "codettes2022";
  message4.destinationName = "codettes2022";

  var values = [message,message2,message3,message4]
  valueToUse = values[Math.floor(Math.random() * values.length)];
  client.send(valueToUse); //here you send the message name .. message1,2,3,4
}

function sendMessageButton(msgtext){
    if (msgtext!=''){
      message = new Paho.MQTT.Message("Keshav says: " +  msgtext);
      message.destinationName = "codettes2022";
      client.send(message);
      console.log(message);
    }
}
// OR listen to the Enter event on n input box
function sendMsg(ele) {
    if(event.key === 'Enter') {
        message = new Paho.MQTT.Message("Alien says: " +  ele.value);
        message.destinationName = "codettes2022";
        client.send(message);
        //alert(ele.value);
       ele.value = ""; // reset the input after entering
        console.log(message);
    }
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:"+responseObject.errorMessage);
  }
}

// called when a message arrives
function onMessageArrived(message) {
  console.log("onMessageArrived:"+ message.payloadString);
  // To do: if user is myself do different style or ignore the message and write directly to log
  document.getElementById("chatlog").innerHTML += "<br>" + message.payloadString
}