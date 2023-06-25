const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const app = express();
require('dotenv').config();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.get("/", function (req, res) {
  const sendData = {
    City: "city",
    description: "description",
    temp: "temp",
    img: "img",
  };
  res.render("index", { sendData: sendData });
});

app.post("/", function (req, res) {
  const city = req.body.cityName;
  console.log(city);
  const apikey=process.env.API_KEY;
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid="+apikey+"&units=metric";
  https.get(url, function (response) {
    console.log(response.statusCode);
    response.on("data", function (data) {
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const weatherDes = weatherData.weather[0].description;
      const image = weatherData.weather[0].icon;
      const weimg = "https://openweathermap.org/img/wn/" + image + "@2x.png";
      //   res.write("<p>The current weather condition is : "+weatherDes+"</p>");
      // res.write("<h1>The current temperature "+city +" is : "+temp+"degree celcius</h1>");
      // res.write("<img src="+weimg+">");
      // res.send();
      const sendData = {};
      sendData.City = city;
      sendData.description = weatherDes;
      sendData.temp = temp;
      sendData.img = weimg;
      // sendData.City=city;
      res.render("status", { sendData: sendData });
    });
  });
});

app.listen(process.env.PORT||3000,function(){
  console.log("Server running on port 3000");
})
