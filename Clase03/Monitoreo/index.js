const cron = require("node-cron");
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const request = require("request");
const services = require("./services.json");

const listServices =
  process.env.NODE_ENV != "production"
    ? services["services-development"]
    : services["services-production"];

const sockets = [];

app.use(express.static("./public"));

http.listen(4000, () => console.log("Server is working on port 4000"));

io.on("connection", socket => {
  sockets.push(socket);

  getStatus();
});

const getStatus = () => {
  listServices.forEach(service => {
    request(`${service.url}/healthcheck`)
      .on("response", response => {
        if (response.statusCode == 200) {
          sockets.forEach(socket => {
            socket.emit("status", { name: service.name, status: "success" });
          });
        } else {
          sockets.forEach(socket => {
            socket.emit("status", { name: service.name, status: "error" });
          });
        }
      })
      .on("error", () => {
        sockets.forEach(socket => {
          socket.emit("status", { name: service.name, status: "error" });
        });
      });
  });
};

cron.schedule("*/20 * * * * *", () => {
  getStatus();
});
