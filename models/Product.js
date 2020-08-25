const { Schema, model, Types, plugin } = require('mongoose');
const slug = require('mongoose-slug-generator');


plugin(slug,{
  separator: "-",
  lang: "en",
  truncate: 120
});

const schema = new Schema({
  slug: { type: String, slug: "title", unique: true },
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  date: { type: Date, default: Date.now },
  owner: { type: Types.ObjectId, ref: "User" }
})

module.exports = model("Product", schema)