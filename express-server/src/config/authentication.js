/*
  Configuration of paths for user authentication.
 */

import { Router } from "express";

import { createUserAccessToken, createUserRefreshToken } from "../db/users";

const FOUR_WEEKS = 4 * 7 * 86400 * 1000;

export default function (passport) {
  const router = Router();

  router.post(
    "/token",
    passport.authenticate("jwt-cookie", { session: false }),
    (req, res) => {
      if (!req.user) return res.send({ success: false });

      const accessToken = createUserAccessToken(req.user);

      return res.send({ success: true, accessToken });
    }
  );

  router.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err); // Will take care of the 500

      if (!user) {
        return res.send({ success: false, message: info.message });
      }

      const accessToken = createUserAccessToken(user);
      const refreshToken = createUserRefreshToken(user);

      res.cookie("jwtToken", refreshToken, {
        expires: new Date(Date.now() + FOUR_WEEKS),
        path: "/token",
        sameSite: "strict",
        httpOnly: true,
      });
      return res.send({
        success: true,
        accessToken,
      });
    })(req, res, next);
  });

  router.post("/logout", (req, res) => {
    req.logOut();
    res.cookie("jwtToken", "", {
      expires: new Date(Date.now() + 1000),
      path: "/token",
      sameSite: "strict",
      httpOnly: true,
    });
    res.send({ success: true });
  });

  return router;
}
