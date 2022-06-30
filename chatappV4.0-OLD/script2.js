// Create a client instance
//client = new Paho.MQTT.Client("test.mosquitto.org", 8080, client_id="", clean_session="true", userdata="none", protocol="MQTTv311", transport="tcp");

var MQTTuser = "Keshav" //add your name/nickname here. default will be set to unspecified alien.

var client = new Paho.MQTT.Client("broker.hivemq.com", 8000, MQTTuser);

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
  if(MQTTuser == '' || MQTTuser == null){
    MQTTuser = "unspecified alien"
  }
  //pick one!
  message = new Paho.MQTT.Message(MQTTuser + " just hopped on! say hi!");
  message2 = new Paho.MQTT.Message(MQTTuser + " just landed! say hello!");
  message3 = new Paho.MQTT.Message(MQTTuser + " joined the party! welcome!");
  message4 = new Paho.MQTT.Message("welcome " + MQTTuser + ", we hope you brought boogie's");
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
      message = new Paho.MQTT.Message(msgtext);
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
    const jsonStr = message.payloadString;
  try {
      const json = JSON.parse(jsonStr);
      console.log(json.age);
  } catch (e) {
      console.log('invalid json');
      //document.getElementById("chatlog").innerHTML += message.payloadString
      var cor = '<h4 class="styletxt">' + '<h5 class="name">' + MQTTuser + "</h5>" + message.payloadString + "</h4>"   // "<h4>" + + "</h4>"
      document.getElementById("chatlog").innerHTML += cor + "<br>"
  }
  //do something else
  //document.getElementById("chatlog").innerHTML += " <li class='list-group-item bg-dark text-light'>  " + message.payloadString +"</li></ul></div>"
  }