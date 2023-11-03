//in server/server.js
const express = require("express");
const bodyParser = require("body-parser");
const { ArduinoIoTCloud } = require("arduino-iot-js");

const app = express();
const port = 3001;

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Welcome to my server!");
});

// let client;

// (async () => {
//     client = await ArduinoIoTCloud.connect({
//       deviceId: '973ac874-436b-4038-88f0-2af5c768ac77',
//       secretKey: 'RAJMRAGRQMSIPHJGCL9Z',
//       onDisconnect: (message) => console.log(message),
//     });
// })();

const sendData = async (type , Device_ID , s_Keys , location , TL , SG , CT  ) => {

      const client = await ArduinoIoTCloud.connect({
        deviceId: Device_ID,
        secretKey: s_Keys,
        onDisconnect: (message) => console.log(message),
      });

      if(type == 0 ){
        client.sendProperty("gps_location", location);
        client.sendProperty("level_sensor", TL);
        client.sendProperty("signal_strength", SG);
        client.sendProperty("temperature", CT);
  
      }else if( type == 1 ){
        client.sendProperty("signal_strength", SG);
        client.sendProperty("temperature", CT);
      }else if( type == 2 ){
        client.sendProperty("gps_location", location);
      }else if( type == 3 ){
        client.sendProperty("level_sensor", TL);
      }

};

app.post("/endpoint", (req, res) => {

  let type = req.body.type;
  let Device_ID = req.body.did;
  let s_Keys = req.body.skey;
  let latitude = req.body.lat;
  let longitude = req.body.lon;

  let location = {
    lat: latitude,
    lon: longitude,
  };


  let TL = req.body.tl;
  let SG = req.body.sg;
  let CT = req.body.ct;

  let response = {
    id: type,
    type: "0",
  };

  sendData(type,Device_ID,s_Keys,location,TL,SG,CT).then((value)=>{
    console.log(response);
    res.send(response);
  });

});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
