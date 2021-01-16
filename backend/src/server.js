const port = process.env.PORT || 3001;
const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const compression = require("compression");
const exegesisExpress = require("exegesis-express");
const http = require("http");
const path = require("path");
const pp = require("passport");

const passport = require("./config/passport")(pp);
const { createUserAccessToken, createUserRefreshToken } = require("./db/users");

async function createServer() {
  const options = {
    controllers: path.resolve(__dirname, "controllers"),
    allowMissingControllers: true,
    treatReturnedJsonAsPure: true,
  };

  const exegesis = await exegesisExpress.middleware(
    path.resolve(__dirname, "openapi.yaml"),
    options
  );

  const app = express();
  app.disable("x-powered-by");
  app.use(morgan(process.env.NODE_ENV === "production" ? "common" : "dev"));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(passport.initialize());
  app.use(compression());
  app.use(cors());
  app.use(helmet());

  app.post("/login", function (req, res, next) {
    passport.authenticate("local", function (err, user, info) {
      if (err) return next(err); // Will take care of the 500

      if (!user) {
        return res.send({ success: false, message: info.message });
      }

      const accessToken = createUserAccessToken(user, info.client);
      const refreshToken = createUserRefreshToken(user, info.client);

      res.cookie("x-ismdb-token", refreshToken, { httpOnly: true });
      return res.send({
        success: true,
        accessToken,
        redirect: info.client.redirectUri,
      });
    })(req, res, next);
  });
  app.use(exegesis);
  app.use((_, res) => {
    res.status(404).json({ message: "Not found" });
  });
  app.use((err, _, res) => {
    res.status(500).json({ message: `Internal error: ${err.message}` });
  });

  const server = http.createServer(app);

  return server;
}

createServer()
  .then((server) => {
    server.listen(port);
    console.log(`Listening on port ${port}`);
  })
  .catch((err) => {
    console.error(err.stack);
    process.exit(1);
  });
