const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DB_URL = "mongodb://localhost:27017/Love";

mongoose.connect(DB_URL);

mongoose.connection.on("connected", () => {
  console.log("mongoose已经连接！");
});

mongoose.connection.on("error", () => {
  console.log("mongoose连接出错！");
});

mongoose.connection.on("disconnected", () => {
  console.log("mongoose断开连接！");
});

const honeySchema = new Schema({
  _id: {type: String},
  name: {type: String},
  age: {type: String},
  height: {type: String},
  workLocation: {type: String},
  marriage: {type: String},
  education: {type: String},
  income: {type: String},
  image: {type: String},
  shortNote: {type: String},
  updateTime: {type: Date, default: Date.now()}
});

module.exports = mongoose.model("love_table", honeySchema);