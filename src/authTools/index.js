const jwt = require("jsonwebtoken");
const User = require("../users/schema");

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

const authenticate = async (user) => {
  try {
    const newAccess = await generateAccessToken({ _id: user._id });
    const newRefresh = await generateRefreshToken({ _id: user._id });
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

module.exports = { authenticate };
