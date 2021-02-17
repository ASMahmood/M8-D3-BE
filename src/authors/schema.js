const { Schema, model } = require("mongoose");

const AuthorSchema = new Schema(
  {
    name: String,
    img: String,
    articles: [{ type: Schema.Types.ObjectId, ref: "Articles" }],
  },
  { timestamps: true }
);

AuthorSchema.static(
  "addArticleIdToAuthor",
  async function (articleID, authorID) {
    await AuthorModel.findByIdAndUpdate(
      authorID,
      {
        $push: {
          articles: articleID,
        },
      },
      { runValidators: true, new: true }
    );
  }
);

const AuthorModel = model("Author", AuthorSchema);

module.exports = AuthorModel;
