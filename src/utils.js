const multer = require("multer");
const bcrypt = require("bcrypt");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + "/public/img");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

//const uploader = multer({ storage });

const uploader = (destinationName) => {
  return multer({
    storage: multer.diskStorage({
      destination: function (_, _, cb) {
        cb(null, path.join(`${__dirname}/public/uploads/${destinationName}`));
      },
      filename: function (_, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
      },
    }),
    onError: function (err, next) {
      console.log(err);
      next();
    },
  });
};

const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));
const isValidPassword = (user, password) => {
  const isPasswordValid = bcrypt.compareSync(password, user.password);
  return isPasswordValid;
};

module.exports = { uploader, createHash, isValidPassword };
