const jwt = require("jsonwebtoken");
const AuthorModel = require("../authors/schema");

const generateAccessToken = (payload) =>
  new Promise((res, rej) =>
    jwt.sign(
      payload,
      process.env.ACCESS_SECRET,
      { expiresIn: "15m" },
      (err, token) => {
        if (err) rej(err);
        res(token);
      }
    )
  );

const generateRefreshToken = (payload) =>
  new Promise((res, rej) =>
    jwt.sign(
      payload,
      process.env.REFRESH_SECRET,
      { expiresIn: "1 week" },
      (err, token) => {
        if (err) rej(err);
        res(token);
      }
    )
  );

const authenticate = async (author) => {
  try {
    const newAccess = await generateAccessToken({ _id: author._id });
    const newRefresh = await generateRefreshToken({ _id: author._id });
    author.tokenArray.push({ token: newRefresh });
    await author.save();
    return { access: newAccess, refresh: newRefresh };
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

const verifyAccess = (token) =>
  new Promise((res, rej) =>
    jwt.verify(token, process.env.ACCESS_SECRET, (err, decodedToken) => {
      if (err) rej(err);
      res(decodedToken);
    })
  );

const authorize = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = await verifyAccess(token);
    const author = await AuthorModel.findOne({ _id: decodedToken._id });
    if (!author) {
      throw new Error();
    }
    req.token = token;
    req.author = author;
    next();
  } catch (error) {
    const err = new Error("NO AUTHENTICATION FOUND");
    err.httpStatusCode = 401;
    next(err);
  }
};

module.exports = { authenticate, authorize };
