module.exports = class UserDto {
  email;
  id;
  name;
  age;
  isActivated;

  constructor(model) {
    this.email = model.email;
    this.id = model._id;
    this.name = model.userName;
    this.age = model.userAge;
    this.isActivated = model.isActivated;
  }
}