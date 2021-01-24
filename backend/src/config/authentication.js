/*
  Configuration of paths for user authentication.
 */

const express = require("express");

const {
  createUserAccessToken,
  createUserRefreshToken,
} = require("../db/users");

const TWO_WEEKS = 14 * 86400 * 1000;

module.exports = function (passport) {
  const router = express.Router();

  router.post("/login", function (req, res, next) {
    passport.authenticate("local", function (err, user, info) {
      if (err) return next(err); // Will take care of the 500

      if (!user) {
        return res.send({ success: false, message: info.message });
      }

      const accessToken = createUserAccessToken(user, info.client);
      const refreshToken = createUserRefreshToken(user, info.client);

      res.cookie("jwtToken", refreshToken, {
        maxAge: TWO_WEEKS,
        httpOnly: true,
      });
      return res.send({
        success: true,
        accessToken,
        redirect: info.client.redirectUri,
      });
    })(req, res, next);
  });

  router.post("/logout", function (req, res) {
    req.logOut();
    res.cookie("jwtToken", "", {
      expires: new Date(Date.now() - 1000),
      httpOnly: true,
    });
    res.send({ success: true });
  });

  return router;
};
