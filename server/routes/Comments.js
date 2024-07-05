const express = require('express');
const router = express.Router();
const { Comments } = require('../models');
const {validateToken} = require('../middlewares/AuthMiddlewares');

router.get('/:postId', async (req, res) =>{
  const postId = req.params.postId;
  const comments = await Comments.findAll({ where:{PostId: postId}})
  res.json(comments);
});

router.post('/', validateToken, async (req, res) => {
  const comment = req.body;
  const username = req.user.username;
  comment.username = username;
  const newComment = await Comments.create(comment); //Save the newComment with id.
  res.json(newComment);
});

router.delete('/:commentId', validateToken, async (req, res) => {
  const commentId = req.params.commentId;
  //Sequelize delete
  await Comments.destroy({where: {
    id: commentId,
  }});
  res.json("DELETED SUCCESSFULLY");
});

module.exports = router;