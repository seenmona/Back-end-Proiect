const sequelize = require("../config/db");

const User = sequelize.import("./user");
const PointOfInterest = sequelize.import("./pointOfInterest");

User.hasMany(PointOfInterest, { onDelete: "Cascade" });

module.exports = { PointOfInterest, User, sequelize };
