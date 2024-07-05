module.exports = (sequelize, DataTypes) => {
  const Posts = sequelize.define("Posts", {
    title: {
      type: DataTypes.STRING, //This is how you define types in sequelize
      allowNull: false //User cannot post posts without a title.
    },// We have a title object that has to defins some stuff.
    postText: {
      type: DataTypes.STRING,
      allowNull: false 
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false 
    },
  });//This is where we define what we want to have in posts table.

  Posts.associate = (models) => {
    Posts.hasMany(models.Comments, {
      onDelete: "cascade",
    });

    Posts.hasMany(models.Likes, {
      onDelete: "cascade",
    });
  }

  return Posts;
};