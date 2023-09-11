const passport = require("passport");
const local = require("passport-local");
const GitHubStrategy = require("passport-github2");
const { createHash, isValidPassword } = require("../utils");
const LocalStrategy = local.Strategy;
const UserDTO = require("../dao/dto/user.dto");
const { UsersDaoFactory } = require("../dao/factory");
const usersService = UsersDaoFactory.getDao();

const initializePassport = () => {
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: "Iv1.ceaa20ba0a92477e",
        clientSecret: "d6a1e22d4cf5c2ad0f55bb937c0847302bd47aff",
        callbackURL: "http://localhost:8080/api/users/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile._json.email;
          let user = await usersService.getUserByEmail(email);
          if (user) {
            return done(null, user);
          }
          const newUser = {
            first_name: profile._json.name || "N/A",
            last_name:
              profile._json.name !== undefined &&
              profile._json.name.includes(" ")
                ? profile._json.name.split(" ")[1]
                : "N/A",
            email: profile._json.email,
            age: 0,
            cart: "",
            role: "",
            password: "password", // tengo la password como required en el model, si la dejo vacia muere todo
          };
          user = new UserDTO({ first_name, last_name, age, role, email });
          await usersService.newUser(newUser);
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
      async (req, email, password, done) => {
        if (req.session.user !== undefined) {
          return res.status(500).json({ error: "Ya hay una sesión iniciada" });
        }
        const { first_name, last_name, age, role } = req.body;
        try {
          let user = await usersService.getUserByEmail(email);
          if (user) {
            return done(null, false, {
              status: 409,
              message: "El email ya está en uso.",
            });
          }

          const newUser = {
            first_name,
            last_name,
            email,
            age,
            role,
            password: createHash(password),
          };
          user = new UserDTO({ first_name, last_name, age, role, email });
          await usersService.newUser(newUser);
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
        try {
          const user = await usersService.getUserByEmail(username);

          if (!user) {
            return done(null, false, {
              message: "User not found",
            });
          }

          if (!isValidPassword(user, password)) {
            return done(null, false, { message: "Wrong credentials" });
          }

          return done(null, user);
        } catch (error) {
          return done({ error: error, message: "Login error" });
        }
      }
    )
  );

  passport.use(
    "current",
    new LocalStrategy(async (req, done) => {
      try {
        if (!req.user) {
          return done(null, false, {
            message: "User not found in session",
          });
        }

        const user = new UserDTO(req.user);
        return done(null, user);
      } catch (error) {
        return done(error, false, { message: "Strategy error" });
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser(async (_id, done) => {
    try {
      const user = await usersService.getUserById(_id);
      done(null, user);
    } catch (error) {
      return done({ message: "Error deserializing User" });
    }
  });
};
module.exports = { initializePassport };
