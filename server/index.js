const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");
const router = require("./router.js");
const PORT = 3000;
const newrelic = require("newrelic");
var compression = require("compression");

const app = express();
app.use(compression());
app.use(cors());
app.use(morgan("dev"));

app.use("/api", router);
app.use("/loaderio-d76742a22ffa41934aaa0d4d621a18d3", (req, res) => {
  res.send("loaderio-d76742a22ffa41934aaa0d4d621a18d3");
});

app.listen(PORT, () => {
  console.log(`Now listening on PORT ${PORT}`);
});
