module.exports = function (sequelize, DataTypes) {
  return sequelize.define("pointOfInterest", {
    name: DataTypes.STRING,
    city: DataTypes.STRING,
    observation: DataTypes.STRING,
    grade: DataTypes.FLOAT,
  });
};
