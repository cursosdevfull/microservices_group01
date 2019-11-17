const cron = require("node-cron");
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const request = require("request");
const services = require("./services.json");

const listServices =
  process.env.NODE_ENV != "production"
    ? services["services-development"]
    : services["services-production"];

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/status", async (req, res) => {
  const results = await getStatus();

  res.json(results);
});

http.listen(4000, () => console.log("Server is working on port 4000"));

const getStatus = () => {
  const promises = [];

  listServices.forEach(service => {
    const pr = new Promise((resolve, reject) => {
      request(`${service.url}/healthcheck`)
        .on("response", response => {
          if (response.statusCode == 200) {
            resolve({ name: service.name, status: "success" });
          } else {
            resolve({ name: service.name, status: "error" });
          }
        })
        .on("error", () => {
          resolve({ name: service.name, status: "error" });
        });
    });

    promises.push(pr);
  });

  return Promise.all(promises);
};
