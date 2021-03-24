const fs = require("fs");
const { productInformation } = require("./db.js");
const mongoose = require("mongoose");
const path = require("path");
const byline = require("byline");

let photosCsv = path.join(__dirname, "../../data/photos.csv");

const reader = fs.createReadStream(photosCsv);
stream = byline.createStream(reader);

const onlyNumbers = (input) => {
  return input.replace(/\D/g, "");
};

var cleanString = (str) => {
  let result = "";
  for (let i = 0; i < str.length; i++) {
    if (i === 0 || i === str.length - 1) {
      if (/[a-zA-Z]/.test(str[i])) {
        result += str[i];
      }
    } else {
      result += str[i];
    }
  }
  return result;
};

mongoose.connection.on("open", function (err, conn) {
  let bulk = productInformation.collection.initializeOrderedBulkOp();
  let counter = 0;

  stream.on("error", function (err) {
    console.log(err);
  });

  stream.on("data", function (line) {
    let row = line.toString("utf-8").split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    if (!row[2]) {
      row = row[0].split(",");
    }
    let obj = {
      id: onlyNumbers(row[0]),
      url: cleanString(row[2]),
      thumbnail_url: cleanString(row[3]),
    };
    bulk
      .find({ results: { $elemMatch: { style_id: row[1] } } })
      .updateOne({ $addToSet: { "results.$.photos": obj } });
    counter++;

    if (counter % 1000 === 0) {
      stream.pause();

      bulk.execute(function (err, result) {
        if (err) throw err;
        bulk = productInformation.collection.initializeOrderedBulkOp();
        stream.resume();
      });
    }
  });

  stream.on("end", function () {
    console.log(counter);
    if (counter % 1000 !== 0) {
      bulk.execute(function (err, result) {
        if (err) throw err;
      });
      console.log("completed writing all the documents");
    }
  });
});
