const generateUserErrorInfo = (user) => {
  return `One or more properties were incomplete or not valid.
    List of required properties:
    *first_name: needs to be a String, received: ${user.first_name}
    *last_name: needs to be a String, received: ${user.last_name}
    *email: needs to be a String, received: ${user.email}`;
};

const generateUserNotFoundInfo = (user) => {
  return `Cant find user.
  *email: needs to be a String, received: ${user.email}
  *password: check if password is correct`;
};

const generateCartNotFoundError = (id) => {
  return `Cant find cart.
  *id: needs to be a String, received: ${id}`;
};

const generateProductNotFoundError = (id) => {
  return `Cant find product.
  *id: needs to be a String, received: ${id}`;
};

module.exports = {
  generateUserErrorInfo,
  generateUserNotFoundInfo,
  generateCartNotFoundError,
  generateProductNotFoundError,
};
