const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");

const AuthorSchema = new Schema(
  {
    name: String,
    img: String,
    articles: [{ type: Schema.Types.ObjectId, ref: "Articles" }],
    email: { type: String, required: true },
    password: { type: String, required: true, minlength: 8, selected: false },
    tokenArray: [{ token: String }],
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

AuthorSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 11);
  }
  next();
});

const AuthorModel = model("Author", AuthorSchema);

module.exports = AuthorModel;
