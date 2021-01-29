/*
  Configuration/setup of passport for authentication.
 */

const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");

const { fetchSingleUserByEmail } = require("../db/users");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        const user = await fetchSingleUserByEmail(email);

        if (user) {
          if (!bcrypt.compareSync(password, user.password)) {
            return done(null, false, { message: "Incorrect password" });
          }
        } else {
          return done(null, false, { message: `Unknown user (${email})` });
        }

        return done(null, user);
      }
    )
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
};
