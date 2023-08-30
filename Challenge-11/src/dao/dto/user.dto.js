class UserDTO {
  constructor(user) {
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.age = user.age;
    this.role = user.role;
    this.email = user.email;
  }
}

module.exports = UserDTO;
