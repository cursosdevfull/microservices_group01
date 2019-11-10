const gateway = require("fast-gateway");
const helmet = require("helmet");
const yenv = require("yenv");
const env = yenv();
const request = require("request");

const validateToken = (req, res, next) => {
  if (req.headers["authorization"]) {
    const parts = req.headers["authorization"].split(" ");
    if (parts.length > 1) {
      let datos = "";
      const token = parts[1];
      request
        .get(
          `http://${env.HOSTS.USERS.HOST}:${env.HOSTS.USERS.PORT}/validate-token?token=${token}`
        )
        .on("data", chunck => (datos += chunck))
        .on("end", () => {
          const response = JSON.parse(datos);
          if (response.status == 200) {
            next();
          } else {
            const response = {
              status: 401,
              message: "User not logged1"
            };

            res.writeHead(401, { "content-type": "application/json" });
            res.end(JSON.stringify(response));
          }
        });
    } else {
      const response = {
        status: 401,
        message: "User not logged2"
      };

      res.writeHead(401, { "content-type": "application/json" });
      res.end(JSON.stringify(response));
    }
  } else {
    const response = {
      status: 401,
      message: "User not logged3"
    };

    res.writeHead(401, { "content-type": "application/json" });
    res.end(JSON.stringify(response));
  }
};

const server = gateway({
  middlewares: [helmet()],
  routes: [
    {
      prefix: "/cinema",
      target: `http://${env.HOSTS.MOVIES.HOST}:${env.HOSTS.MOVIES.PORT}`,
      middlewares: [validateToken]
    },
    {
      prefix: "/users",
      target: `http://${env.HOSTS.USERS.HOST}:${env.HOSTS.USERS.PORT}`
    },
    {
      prefix: "/monitoreo",
      target: `http://${env.HOSTS.MONITOREO.HOST}:${env.HOSTS.MONITOREO.PORT}`
    }
  ]
});

server
  .start(env.PORT)
  .then(() => console.log(`Gateway is running on port ${env.PORT}`))
  .catch(err => {
    console.log(err);
    process.exit(1);
  });
