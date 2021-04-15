const dbHelpers = require("./database/dbHelpers.js");

const controllers = {
  allProducts: (req, res) => {
    dbHelpers.allProducts(req, (err, data) => {
      if (err) {
        res.status(400).send(err);
      } else {
        res.send(data);
      }
    });
  },
  getProduct: (req, res) => {
    dbHelpers.getProduct(req, (err, data) => {
      if (data === null) {
        return res.send("sorry cant find that!");
      }
      data = data.toJSON();
      const formattedData = {
        id: data.product_id,
        name: data.name,
        slogan: data.slogan,
        description: data.description,
        category: data.category,
        default_price: data.default_price,
        features: data.features,
      };
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(200).send(formattedData);
      }
    });
  },
  getStyles: (req, res) => {
    dbHelpers.getStyles(req, (err, data) => {
      if (data === null) {
        return res.send("sorry cant find that!");
      }
      data = data.toJSON();
      let formattedData = {
        product_id: data.product_id,
        results: data.results,
      };
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(200).send(formattedData);
      }
    });
  },
  getRelated: (req, res) => {
    dbHelpers.getRelated(req, (err, data) => {
      if (data === null) {
        return res.send("sorry cant find that!");
      }
      data = data.toJSON();
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(200).send(data.related_products);
      }
    });
  },
};

module.exports = controllers;
