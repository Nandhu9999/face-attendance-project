const bcrypt = require("bcrypt");

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hashSync(password, salt);
};

const comparePassword = async (password, hash) => {
  return bcrypt.compareSync(password, hash);
};

module.exports = {
  hashPassword,
  comparePassword,
};
