const LineInputStream = require("line-input-stream");
const fs = require("fs");
const mongoose = require("mongoose");
const path = require("path");
const byline = require("byline");
const { productInformation } = require("./db.js");

const skusCsv = path.join(__dirname, "../../data/skus.csv");

const reader = fs.createReadStream(skusCsv);
const stream = byline.createStream(reader);

const onlyNumbers = (input) => input.replace(/\D/g, "");

const cleanString = (str) => {
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

mongoose.connection.on("open", (err, conn) => {
  let bulk = productInformation.collection.initializeOrderedBulkOp();
  let counter = 0;

  stream.on("error", (err) => {
    console.log(err);
  });

  stream.on("data", (line) => {
    const row = line.toString("utf-8").split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    const obj = {};
    obj.size = cleanString(row[2]);
    obj.quantity = onlyNumbers(row[3]);

    const $set = { $set: {} };
    $set.$set[`results.$.skus.${row[0]}`] = obj;

    bulk
      .find({ results: { $elemMatch: { style_id: row[1] } } })
      .updateOne($set);
    counter++;

    if (counter % 1000 === 0) {
      stream.pause();

      bulk.execute((err, result) => {
        if (err) throw err;
        bulk = productInformation.collection.initializeOrderedBulkOp();
        stream.resume();
      });
    }
  });

  stream.on("end", () => {
    if (counter % 1000 !== 0) {
      bulk.execute((err, result) => {
        if (err) throw err;
      });
      console.log("completed writing all the documents");
    }
  });
});
