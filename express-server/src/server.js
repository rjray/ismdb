import express, { urlencoded, json } from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
// const morgan = require("morgan");
import compression from "compression";
import { middleware } from "exegesis-express";
import { exegesisPassport } from "exegesis-passport";
import { createServer as _createServer } from "http";
import { resolve } from "path";
import { Passport } from "passport";

require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

const port = process.env.PORT || 3001;

const passport = require("./config/passport").default(new Passport());
const authLayer = require("./config/authentication").default(passport);

async function createServer() {
  const app = express();
  app.disable("x-powered-by");
  // app.use(morgan(process.env.NODE_ENV === "production" ? "common" : "dev"));
  app.use(cookieParser());
  app.use(urlencoded({ extended: false }));
  app.use(json());
  app.use(passport.initialize());
  app.use(compression());
  app.use(cors({ origin: process.env.ALLOWED_ORIGIN, credentials: true }));
  app.use(helmet());

  app.use(authLayer);
  app.use(
    await middleware(resolve(__dirname, "openapi.yaml"), {
      controllers: resolve(__dirname, "controllers"),
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

  const server = _createServer(app);

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
