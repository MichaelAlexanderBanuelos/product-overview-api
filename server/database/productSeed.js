const LineInputStream = require("line-input-stream");
const fs = require("fs");
const { product, productInformation } = require("./db.js");
const mongoose = require("mongoose");
const path = require("path");

let filename = path.join(__dirname, "../../data/product.csv");

let LineByLineReader = require("line-by-line");
let lr = new LineByLineReader(filename);

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
  let bulk = product.collection.initializeOrderedBulkOp();
  let counter = 0;

  lr.on("error", function (err) {
    console.log(err);
  });

  lr.on("line", function (line) {
    let row = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    let obj = {
      product_id: onlyNumbers(row[0]),
      name: cleanString(row[1]),
      slogan: cleanString(row[2]),
      description: cleanString(row[3]),
      category: cleanString(row[4]),
      default_price: onlyNumbers(row[5]),
    };

    bulk.insert(obj);
    counter++;

    if (counter % 1000 === 0) {
      lr.pause();

      bulk.execute(function (err, result) {
        if (err) throw err;
        bulk = product.collection.initializeOrderedBulkOp();
        lr.resume();
      });
    }
  });

  lr.on("end", function () {
    console.log(counter);
    if (counter % 1000 !== 0) {
      bulk.execute(function (err, result) {
        if (err) throw err;
      });
      console.log("completed writing all the documents for product!");
    }
  });
});
