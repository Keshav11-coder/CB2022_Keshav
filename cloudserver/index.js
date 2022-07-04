// 1. host an MQTT client page
// 2. capture all messages from MQTT for logging
// 3. Store messages into MongoDB
const express = require("express")
const path = require("path")
const app = express()

// MQTT client connection on NodeJS
var userList = [] // manage the userlist
var messages = [] // message log dit wordt straks die MongoDB

const mqtt = require('mqtt')
const client = mqtt.connect("ws://broker.hivemq.com:8000/mqtt")

client.on('connect', function () {
  client.subscribe('codettes2022', function (err) {
    if (!err) {
      client.publish('codettes2022', 'keshavs NodeJS server started. live now,all messages/users being stored')
    }
  })
})

client.on('message', function (topic, message) {
  var MongoClient = require('mongodb').MongoClient;
  var url = "mongodb://0.0.0.0:27017/";
  // message is Buffer
  try {
    msgObj = JSON.parse(message.toString()); // t is JSON so handle it how u want
    // if message has Ping of Pong in it send it to the PingPongHandler
    if (Object.keys(msgObj)[0] == "ping") {
      sendPong("codettes2022", "Keshavs NODEJS server", "cb_12345678");
    };
    if (Object.keys(msgObj)[0] == "pong") {
      handlePong(msgObj.pong);
    }; // pong value is an object!!
    // other handlers for control messages below
  } catch {
    messages.push({ "time": Date(), "topic": topic, "message": message.toString() });
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db("chatapp");
      var messageee = message.toString();
      var msgvar = [{ "msg": messageee }];
      dbo.collection("messages").insertMany(msgvar, function (err, res, collection) {
        if (err) throw err;
        console.log("Number of documents inserted for <messages>: " + res.insertedCount);
        //db.close();
      });
      const collection = dbo.collection('messages')
      collection.find().toArray((err, items) => {
        //console.log(items)
      })
    });
  }
  console.log(message.toString())
})

function sendPing(usr = '*', mqttTopic = "codettes2022") {
  // ping sends out a message to all (*) or any specific user to respond if ur there
  var pingObj = {
    ping: usr
  }; // JS Object {ping : "usr"} -> JSON {/"ping/":/"usr/"}
  client.publish(mqttTopic, JSON.stringify(pingObj));
}

function sendPong(_mqttTopic = "codettes2022", _userName = "Keshavs NODEJS server", _clientId = "cb_12345678") {
  // sends clientID and UserName in a JSON object (and whatever u need more)
  var pongObj = {
    pong: {
      userName: _userName,
      clientId: _clientId
    }
  };
  console.log(JSON.stringify(pongObj));
  client.publish(_mqttTopic, JSON.stringify(pongObj));
}

// function that manages the UserList and other UI stuff related to PingPong
function handlePong(pongObj) {
  // Update Userlist with Pongs
  var MongoClient = require('mongodb').MongoClient;
  var url = "mongodb://0.0.0.0:27017/";
  const index = userList.findIndex(object => {
    return object.userName === pongObj.userName;
  })

  //console.log("index:" + index);
  if (index >= 0) {
    console.log("User exists");
    userList[index] = pongObj;
  } else {
    console.log("New User " + pongObj.userName);
    userList.push(pongObj);
  }
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("chatapp");
    var usrnm = pongObj.userName.toString();
    var usrvar = [{ "USR": usrnm }];
    dbo.collection("users").insertMany(usrvar, function (err, res, collection) {
      if (err) throw err;
      console.log("Number of documents inserted for <users>: " + res.insertedCount);
      //db.close();
    });
    const collection = dbo.collection('users')
    collection.find().toArray((err, items) => {
      //idk what to do here
    })
  });
}

// Express static webserserver 
const publicDirectoryPath = path.join(__dirname, 'data')
app.use('/', express.static(publicDirectoryPath))


// Express API routes
app.get('/api.syscore.log', (req, res) => {
  var MongoClient = require('mongodb').MongoClient;
  var url = "mongodb://0.0.0.0:27017/";
  MongoClient.connect(url, function (err, db) {
    var dbo = db.db("chatapp");
    const collection = dbo.collection('messages')
    collection.find().sort({ '_id': -1 }).limit(10).toArray((err, items) => { //.limit(-10)
      res.send(items)
    })
  });
})

app.get('/api.syscore.users', (req, res) => {
  var MongoClient = require('mongodb').MongoClient;
  var url = "mongodb://0.0.0.0:27017/";
  MongoClient.connect(url, function (err, db) {
    var dbo = db.db("chatapp");
    const collection = dbo.collection('users')
    collection.find().sort({ '_id': -1 }).limit(10).toArray((err, items) => {
      res.send(items)
    })
  });
})

app.get('/api.public.pforms', (req, res) => {
  res.send("platforms being used:: mqtt, hiveMQ, mongodb, mongoose, mongodbCOMPASS, NODEJS")
})

app.listen(3000, () => {
  console.log(" NODEJS Server has started. listening, storing live")
})