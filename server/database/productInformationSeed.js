const LineInputStream = require("line-input-stream");
const fs = require("fs");
const { productInformation } = require("./db.js");
const mongoose = require("mongoose");
const path = require("path");

let featuresCsv = path.join(__dirname, "../../data/features.csv");

let LineByLineReader = require("line-by-line");
let featuresStream = new LineByLineReader(featuresCsv);

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

  featuresStream.on("error", function (err) {
    console.log(err);
  });

  featuresStream.on("line", function (line) {
    let row = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    let featuresObj = {
      feature: cleanString(row[2]),
      value: cleanString(row[3]),
    };
    let obj = {
      product_id: onlyNumbers(row[1]),
      features: [featuresObj],
    };
    bulk.find({ product_id: row[1] }).upsert().updateOne({
      $setOnInsert: obj,
    });
    bulk
      .find({ product_id: row[1] })
      .updateOne({ $addToSet: { features: featuresObj } });
    counter++;

    if (counter % 1000 === 0) {
      featuresStream.pause();

      bulk.execute(function (err, result) {
        if (err) throw err;
        bulk = productInformation.collection.initializeOrderedBulkOp();
        featuresStream.resume();
      });
    }
  });

  featuresStream.on("end", function () {
    console.log(counter);
    if (counter % 1000 !== 0) {
      bulk.execute(function (err, result) {
        if (err) throw err;
      });
      console.log("completed writing all the documents");
    }
  });
});
