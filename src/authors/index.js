const express = require("express");
const AuthorSchema = require("./schema");

const authorRouter = express.Router();

authorRouter.get("/", async (req, res) => {
  try {
    if (req.query.name) {
      const author = await AuthorSchema.findOne({ name: req.query.name });
      if (author) {
        res.status(200).send(author);
      } else {
        res.status(404).send("no author with that name");
      }
    } else {
      const allAuthors = await AuthorSchema.find();
      res.status(200).send(allAuthors);
    }
  } catch (error) {
    console.log(error);
    res.send("Something went wrong");
  }
});

authorRouter.post("/registser", async (req, res) => {
  try {
    const newAuthor = new AuthorSchema(req.body);
    const { _id } = await newAuthor.save();
    res.status(201).send(_id);
  } catch (error) {
    console.log(error);
    res.send("Something went wrong");
  }
});

authorRouter.get("/:id", async (req, res) => {
  try {
    const selectedAuthor = await AuthorSchema.findById(req.params.id).populate(
      "articles"
    );
    if (selectedAuthor) {
      res.status(200).send(selectedAuthor);
    } else {
      res.status(404).send("We couldn't find an author with that id");
    }
  } catch (error) {
    console.log(error);
    res.send("Something went wrong");
  }
});

authorRouter.delete("/:id", async (req, res) => {
  try {
    const author = await AuthorSchema.findByIdAndDelete(req.params.id);
    if (author) {
      res.send("AUTHOR DELETED");
    } else {
      res.status(404).send("AUTHOR NOT FOUND");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

authorRouter.put("/:id", async (req, res) => {
  try {
    const author = await AuthorSchema.findByIdAndUpdate(
      req.params.id,
      req.body,
      { runValidators: true, new: true }
    );
    if (author) {
      res.send(author);
    } else {
      res.status(404).send("ARTICLE NOT FOUND");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});
module.exports = authorRouter;
