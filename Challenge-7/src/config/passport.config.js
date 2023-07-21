const passport = require("passport");
const local = require("passport-local");
const User = require("../dao/models/user.model");
const GitHubStrategy = require("passport-github2");
const { createHash, validatePassword } = require("../utils");
const LocalStrategy = local.Strategy;

const initializePassport = () => {
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientId: "Iv1.ceaa20ba0a92477e",
        clientSecret: "d6a1e22d4cf5c2ad0f55bb937c0847302bd47aff",
        callbackURL: "http://localhost:8080/api/users/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        const { first_name, last_name, email, age } = req.body;
        try {
          let user = await User.findOne({ email: profile._json.email });
          if (user) return done(null, false);
          const newUser = {
            first_name: profile._json.name,
            last_name: profile._json.name,
            email: profile._json.email,
            age: 0,
            password: "",
          };
          user = await User.create(newUser);
          return done(null, user);
        } catch (error) {
          return done({ message: "User creation error" });
        }
      }
    )
  );
  passport.use(
    "register",
    new LocalStrategy(
      { usernameField: "email", passReqToCallback: true },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        try {
          let user = await User.findOne({ email: username });
          if (user) return done(null, false);
          const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
          };
          user = await User.create(newUser);
          return done(null, user);
        } catch (error) {
          return done({ message: "User creation error" });
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        try {
          let user = await User.findOne({ email: username });
          if (!user) return done(null, false, { message: "User not found" });
          if (!validatePassword(user, password)) return done(null, false);
          return done(null, user);
        } catch (error) {
          return done({ message: "Login error" });
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser(async (_id, done) => {
    try {
      const user = await User.findOne({ _id });
      done(null, user);
    } catch (error) {
      return done({ message: "Error deserializing User" });
    }
  });
};
export default initializePassport;
