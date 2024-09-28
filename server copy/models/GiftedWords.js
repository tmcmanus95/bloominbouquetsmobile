const { Schema, model } = require("mongoose");

//Schema for user model
const giftedWordsSchema = new Schema({
  giftedWords: [
    {
      type: String,
    },
  ],
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

// set up pre-save middleware to create password
//Initialize user model
const GiftedWords = model("GiftedWords", giftedWordsSchema);

module.exports = GiftedWords;
