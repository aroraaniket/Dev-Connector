const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');
const Post = require('../../models/Post');
const Profile = require('../../models/profile');
//first we are making router as handler
//and will export it
//to use it in server.js file
//@route /api/posts
//@desc create a post
//@@access private
router.post(
  '/',
  [auth, [check('text', 'Text is required').not().isEmpty()]],
  async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id).select('-password');
      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });
      const post = await newPost.save();
      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('server error');
    }
  }
);
//@route /api/posts
//@desc Get a post
//@@access public
router.get('/', auth, async function (req, res) {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
});
//@route /api/posts/:post_id
//@desc Get a post
//@@access private
router.get('/:id', auth, async function (req, res) {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: 'No post found' });
    }
    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'No post found' });
    }

    res.status(500).send('server error');
  }
});
//@route /api/posts
//@desc Delete a post
//@@access private
router.delete('/:id', auth, async function (req, res) {
  try {
    const post = await Post.findById(req.params.id);
    //check if there is a post
    if (!post) {
      return res.status(404).json({ msg: 'No posts found' });
    }
    //check user
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not Authorized' });
    }
    await post.remove();
    res.json({ msg: 'Post deleted' });
  } catch (error) {
    console.error(err.message);
    res.status(500).send('server error');
  }
});
//@route /api/posts/likes/:id
//@desc Like a post
//@@access private
router.put('/like/:id', auth, async function (req, res) {
  try {
    const post = await Post.findById(req.params.id);
    //check if user already liked the post
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: 'Post already liked' });
    }
    post.likes.unshift({ user: req.user.id });
    await post.save(); 
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
});
//unlike a post
router.put('/unlike/:id', auth, async function (req, res) {
  try {
    const post = await Post.findById(req.params.id);
    //check if user already liked the post
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: 'Post has not been  liked yet' });
    }
    //remove index
    /* const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexof(req.params.id);*/
    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);
    post.likes.splice(removeIndex, 1);
    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
});
//@route /api/posts/comments/:id
//@desc create a post
//@@access private
router.post(
  '/comment/:id',
  [auth, [check('text', 'Text is required').not().isEmpty()]],
  async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id).select('-password');
      const post = await Post.findById(req.params.id);
      const newcomment = {
        text: req.body.text,
        name: user.name,
        user: req.user.id,
        avatar: user.avatar,
      };
      post.comments.unshift(newcomment);
      await post.save();
      res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('server error');
    }
  }
);
//@route /api/posts/comment/:id
//@desc Delete a post
//@@access private
router.delete('/comment/:id/:comment_id', auth, async function (req, res) {
  try {
    const post = await Post.findById(req.params.id);
    //pull out comment
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );
    //make sure comment exist
    if (!comment) {
      return res.status(404).json({ msg: 'No comment found' });
    }
    //check user
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not Authorized' });
    }
    const removeIndex = post.comments
      .map((comment) => comment.user.toString())
      .indexOf(req.user.id);
    post.comments.splice(removeIndex, 1);
    await post.save();
    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
});
module.exports = router;
