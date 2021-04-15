const { product, productInformation } = require("./db.js");

const dbHelpers = {
  allProducts: (req, callback) => {
    const pageOptions = {
      page: parseInt(req.query.page, 10) || 0,
      limit: parseInt(req.query.count, 10) || 10,
    };
    product.find(
      {},
      null,
      { limit: pageOptions.limit, skip: pageOptions.page },
      (err, data) => {
        callback(err, data);
      }
    );
  },
  getProduct: (req, callback) => {
    productInformation.findOne(
      { product_id: req.params.product_id },
      (err, result) => {
        callback(err, result);
      }
    );
  },
  getStyles: (req, callback) => {
    productInformation.findOne(
      { product_id: req.params.product_id },
      (err, result) => {
        callback(err, result);
      }
    );
  },
  getRelated: (req, callback) => {
    productInformation.findOne(
      { product_id: req.params.product_id },
      (err, result) => {
        callback(err, result);
      }
    );
  },
};

module.exports = dbHelpers;
