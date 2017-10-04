'use strict';
module.exports = (sequelize, DataTypes) => {
  var document = sequelize.define('document', {
    body: DataTypes.TEXT,
    userId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        models.document.belongsTo(models.user);
        // associations can be defined here
      }
    }
  });
  return document;
};
