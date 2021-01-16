/*
  Configuration/setup of passport for authentication.
 */

const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;

const { fetchSingleUserByEmail } = require("../db/users");
const { fetchSingleAuthClientById } = require("../db/authclients");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },
      async (req, email, password, done) => {
        const { client } = req.body;

        if (!(client && email)) {
          return done(null, false, { message: "Missing client or email" });
        }

        const user = await fetchSingleUserByEmail(email);
        const authclient = await fetchSingleAuthClientById(client);

        if (!authclient) {
          return done(null, false, { message: "Unknown client" });
        }

        if (user) {
          if (!bcrypt.compareSync(password, user.password)) {
            return done(null, false, { message: "Incorrect password " });
          }
        } else {
          return done(null, false, { message: "Unknown user" });
        }

        return done(null, user, { client: authclient });
      }
    )
  );

  return passport;
};
