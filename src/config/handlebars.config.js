const hbs = require("express-handlebars");

const handlebarsConfig = hbs.create({
  helpers: {
    isEqual: function (value1, value2, options) {
      return value1 === value2 ? options.fn(this) : options.inverse(this);
    },
  },
});

module.exports = {
  configureHandlebars: (app) => {
    app.engine("hbs", handlebarsConfig.engine);
    app.set("view engine", "hbs");
  },
};