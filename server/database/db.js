const mongoose = require("mongoose");

mongoose.connect("mongodb://mikey:password@54.193.65.171:27017/sdc", {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("connected", function () {
  console.log("Mongoose default connection open to sdc");
});

const Schema = mongoose.Schema;

const essentialInfo = new Schema(
  {
    _id: mongoose.Types.ObjectId,
    id: String,
    name: String,
    slogan: String,
    description: String,
    category: String,
    default_price: String,
  },
  { strict: false }
);

const allInfo = new Schema({
  _id: mongoose.Types.ObjectId,
  product_id: { type: String, index: true },
  features: [
    {
      feature: String,
      value: String,
    },
  ],
  results: [
    {
      style_id: { type: String, index: true },
      name: String,
      original_price: String,
      sale_price: String,
      default: Number,
      photos: [
        {
          thumnail_url: String,
          url: String,
        },
      ],
      skus: {
        number: {
          quantity: Number,
          size: String,
        },
      },
    },
  ],
  related_products: Array,
});
allInfo.index({ product_id: 1 });
allInfo.index({ style_id: 1 });

const product = mongoose.model("product", essentialInfo);
const productInformation = mongoose.model("productinformation", allInfo);

module.exports = {
  product: product,
  productInformation: productInformation,
};
