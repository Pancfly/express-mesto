const { Mongoose } = require("mongoose");

const userSchema = new Mongoose.Schema({
  name: {
    type: String,
  },
  about: {
    type: String,
  },
  avatar: {
    type: String,
  }
});

module.exports = Mongoose.model('user', userSchema);