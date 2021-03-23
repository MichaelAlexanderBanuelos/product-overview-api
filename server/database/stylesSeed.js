const LineInputStream = require("line-input-stream");
const fs = require("fs");
const { productInformation } = require("./db.js");
const mongoose = require("mongoose");
const path = require("path");

let stylesCsv = path.join(__dirname, "../../data/styles.csv");

let LineByLineReader = require("line-by-line");
let stylesStream = new LineByLineReader(stylesCsv);

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

  stylesStream.on("error", function (err) {
    console.log(err);
  });

  stylesStream.on("line", function (line) {
    let row = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    let obj = {
      style_id: onlyNumbers(row[0]),
      name: cleanString(row[2]),
      sale_price: row[3],
      original_price: onlyNumbers(row[4]),
      default_style: onlyNumbers(row[5]),
      photos: [],
      skus: {},
    };
    bulk
      .find({ product_id: row[1] })
      .updateOne({ $addToSet: { results: obj } });
    counter++;

    if (counter % 1000 === 0) {
      stylesStream.pause();

      bulk.execute(function (err, result) {
        if (err) throw err;
        bulk = productInformation.collection.initializeOrderedBulkOp();
        stylesStream.resume();
      });
    }
  });

  stylesStream.on("end", function () {
    console.log(counter);
    if (counter % 1000 !== 0) {
      bulk.execute(function (err, result) {
        if (err) throw err;
      });
      console.log("completed writing all the documents");
    }
  });
});
