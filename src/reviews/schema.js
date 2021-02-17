const { Schema, model } = require("mongoose");

const ReviewsSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
    user: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model("Reviews", ReviewsSchema);
