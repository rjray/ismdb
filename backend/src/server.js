"use strict";

const port = process.env.PORT || 3000;
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const exegesisExpress = require("exegesis-express");
const http = require("http");
const path = require("path");

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
  app.use(cors());
  app.use(exegesis);
  app.use(helmet());
  app.use((_, res) => {
    res.status(404).json({ message: "Not found" });
  });
  app.use((err, _, res, __) => {
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
