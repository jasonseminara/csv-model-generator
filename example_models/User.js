const faker = require('faker');

module.exports = {
  fake() {
    return {
      firstname: faker.name.firstName,
      lastname:  faker.name.lastName,
      username:  faker.internet.userName,
      email:     faker.internet.email,
      avatar:    faker.internet.avatar,
      password:  faker.lorem.word,
    };
  }
};
