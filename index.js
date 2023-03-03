const bodyParser = require("body-parser");
const express = require("express");
const axios = require("axios");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});
app.get("/weather", (req, res) => {
  const data={
    location:"salars",
    temp:"30s",
    desc:"sunnys"
  }
  res.render("index",{data:data});
});
app.post("/liveweather", async (req, res) => {
  const cityName = req.body.city;
  let URL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=a261965f5d649c093dbbaee0b0b2ac23`;
  let response = await axios.get(URL);
  let weatherData = response.data;
  let disc = weatherData.weather[0].description;
  let temp = Math.floor(weatherData.main.temp);
  res.write(`<h1>Current weather in ${cityName} is "${disc}"</h1>`);
  res.write(`<h1>Current temp in ${cityName} is ${temp} Degree Celcius</h1>`);
  res.send();
});
app.post("/weather", async (req, res) => {
  const cityName = req.body.city;
  try {
    let URL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=a261965f5d649c093dbbaee0b0b2ac23`;
    let response = await axios.get(URL);
    let weatherData = response.data;
    let disc = weatherData.weather[0].description;
    let temp = Math.floor(weatherData.main.temp);

    const data = {};

    data.location = cityName;
    data.temp = temp;
    data.desc = disc;

    res.render("index", { data: data });
  } catch (err) {
    const data ={
      cityName: cityName,
    }
    console.log(err);
    // res.status(404).json({ data: "not Found" });
    res.render("pnf", { data: data });
  }
});

app.listen(port, (err) => {
  if (err) {
    throw err;
  } else {
    console.log(`App listening on port ${port}!`);
  }
});
