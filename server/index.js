const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");
const router = require("./router.js");

const PORT = 3000;
const newrelic = require("newrelic");
const compression = require("compression");

const app = express();
app.use(compression());
app.use(cors());
app.use(morgan("dev"));

app.use("/api", router);
app.use("/loaderio-5ae189573ca597afb385dfe70e3efbe8", (req, res) => {
  res.send("loaderio-5ae189573ca597afb385dfe70e3efbe8");
});

app.listen(PORT, () => {
  console.log(`Now listening on PORT ${PORT}`);
});
