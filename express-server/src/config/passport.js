/*
  Configuration/setup of passport for authentication.
 */

import { compareSync } from "bcrypt";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

import { fetchSingleUserByUsername } from "../db/users";

export default function (passport) {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      const user = await fetchSingleUserByUsername(username);

      if (user) {
        if (!compareSync(password, user.password)) {
          return done(null, false, { message: "Incorrect password" });
        }
      } else {
        return done(null, false, { message: `Unknown user (${username})` });
      }

      return done(null, user);
    })
  );

  passport.use(
    "jwt-header",
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.ACCESS_TOKEN_SECRET,
        issuer: "ismdb.net",
      },
      ({ user }, done) => (user ? done(null, user) : done(null, false))
    )
  );

  passport.use(
    "jwt-cookie",
    new JwtStrategy(
      {
        jwtFromRequest: (req) => req?.cookies.jwtToken,
        secretOrKey: process.env.REFRESH_TOKEN_SECRET,
        issuer: "ismdb.net",
      },
      ({ user }, done) => (user ? done(null, user) : done(null, false))
    )
  );

  return passport;
}
