require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

const port = process.env.PORT || 3001;
const express = require("express");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const cors = require("cors");
// const morgan = require("morgan");
const compression = require("compression");
const exegesisExpress = require("exegesis-express");
const { exegesisPassport } = require("exegesis-passport");
const http = require("http");
const path = require("path");
const { Passport } = require("passport");

const passport = require("./config/passport")(new Passport());
const authLayer = require("./config/authentication")(passport);

async function createServer() {
  const app = express();
  app.disable("x-powered-by");
  // app.use(morgan(process.env.NODE_ENV === "production" ? "common" : "dev"));
  app.use(cookieParser());
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(passport.initialize());
  app.use(compression());
  app.use(cors({ origin: process.env.ALLOWED_ORIGIN, credentials: true }));
  app.use(helmet());

  app.use(authLayer);
  app.use(
    await exegesisExpress.middleware(path.resolve(__dirname, "openapi.yaml"), {
      controllers: path.resolve(__dirname, "controllers"),
      authenticators: {
        userToken: exegesisPassport(passport, "jwt-header"),
      },
      onResponseValidationError: (result) => {
        console.warn(JSON.stringify(result.errors, null, 2));
      },
      allErrors: true,
      strictValidation: true,
      allowMissingControllers: true,
      treatReturnedJsonAsPure: true,
    })
  );
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
