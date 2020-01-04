"use strict"

const port = process.env.PORT || 3000
const express = require("express")
const helmet = require("helmet")

var app = express()
app.use(express.json())
app.use(helmet())
app.get("/", (req, res) => res.send("OK"))

console.log("Server started")
app.listen(port)
