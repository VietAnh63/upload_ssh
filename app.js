//import express
const express = require("express");
const app = express();
const server = require("http").Server(app);

//import morgan
const logger = require("morgan");
app.use(logger("dev"));

//import body-parser
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//set public
app.use(express.static("public"));

//import router
const routerManagerClient = require("./routers/manager_router");
app.use("/", routerManagerClient);

//import ejs
app.set("view engine", "ejs");
app.set("views", "./views");

const port = 3000;
server.listen(port, function () {
  console.log(`Server is running port ${port}`);
});
