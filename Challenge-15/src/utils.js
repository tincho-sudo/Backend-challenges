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

const uploader = multer({ storage });

const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));
const isValidPassword = (user, password) => {
  const isPasswordValid = bcrypt.compareSync(password, user.password);
  return isPasswordValid;
};

module.exports = { uploader, createHash, isValidPassword };
