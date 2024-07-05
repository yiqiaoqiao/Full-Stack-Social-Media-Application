const express = require('express'); //Express library consists of routing system implemented
const router = express.Router();
const { Posts, Likes } = require('../models'); //Posts is the table that we created in models
const {validateToken} = require('../middlewares/AuthMiddlewares');

//Put all the requests here (PUT, GET, etc.)
router.get("/", validateToken, async (req, res) => {
  const listOfPosts = await Posts.findAll({ include: [Likes] });
  const likedPosts = await Likes.findAll({where: {UserId: req.user.id}});
  res.json({listOfPosts: listOfPosts, likedPosts: likedPosts});
});

router.get('/byId/:id', async (req, res) =>{
  const id = req.params.id; //This id is getting from :id.
  const post = await Posts.findByPk(id); //Find by Primary Key
  res.json(post);
});

router.get('/byUserId/:id', async (req, res) =>{
  const id = req.params.id;
  const listOfPosts = await Posts.findAll({
    where: { UserId: id },
    include: [Likes],
  });
  res.json(listOfPosts);
});

router.post("/", validateToken, async (req, res) => {
  const post = req.body; //If we want to access the title we can use: post.title
  post.username = req.user.username;
  post.UserId = req.user.id;
  await Posts.create(post); //wait for the post to be inserted before moving on.
  res.json(post); //return the post after it is inserted in to the table.
});

router.delete("/:postId", validateToken, async (req, res) => {
  const postId = req.params.postId;
  await Posts.destroy({where: {
    id: postId,
  }});
  res.json("DELETED SUCCESSFULLY");
});

router.put("/title", validateToken, async (req, res) => {
  const { newTitle, id } = req.body;
  await Posts.update({ title: newTitle }, { where: { id: id } });
  res.json(newTitle);
});

router.put("/postText", validateToken, async (req, res) => {
  const { newText, id } = req.body;
  await Posts.update({ postText: newText }, { where: { id: id } });
  res.json(newText);
});


module.exports = router; //Export all the routers created for this file