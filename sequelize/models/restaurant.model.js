const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
	sequelize.define('restaurant', {
		// The following specification of the 'id' attribute could be omitted
		// since it is the default.
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
		name: {
			allowNull: false,
			type: DataTypes.STRING,
			unique: true,
		},
		is_gluten_free_friendly: {
			type: DataTypes.BOOLEAN,
    		defaultValue: false
		},
		is_vegetarian_friendly: {
			type: DataTypes.BOOLEAN,
    		defaultValue: false
		},
		is_vegan_friendly: { 
			type: DataTypes.BOOLEAN,
    		defaultValue: false
		},
		is_paleo_friendly:{
			type: DataTypes.BOOLEAN,
    		defaultValue: false
		}
	});
};
