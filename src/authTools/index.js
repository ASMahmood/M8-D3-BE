const jwt = require("jsonwebtoken");

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

module.exports = { authenticate };
