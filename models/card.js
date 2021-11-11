const { Mongoose } = require("mongoose");

const cardSchema = new Mongoose.Schema({
  name: {
    type: String,
  },
  link: {
    type: String,
  },
  owner: {
    type: ObjectId,
  },
  likes: {
    type: ObjectId,
  },
  createdAt: {
    type: Date,
  }
});

module.exports = Mongoose.model('card', cardSchema);