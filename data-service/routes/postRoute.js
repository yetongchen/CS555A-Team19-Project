import express from "express";
import data from "../data/index.js";
const createPost = data.posts.createPost;
const getPostByEventId = data.posts.getPostByEventId;
const getPostByPostId = data.posts.getPostByPostId;
const removePostByPostId = data.posts.removePostByPostId;

// import {
//   createPost,
//   getPostByPostId,
//   removePostByPostId,
// } from "../data/postData.js";
import { posts } from "../config/mongoCollections.js";

const router = express.Router();

//Only for testing
router.get("/", async (req, res) => {
  try {
    let postsCollection = posts();

    let data = await postsCollection.find({}).toArray();
    res.status(200).json(data);
  } catch (error) {
    res.json(error);
  }
});

router.route("/new").post(async (req, res) => {
  try {
    console.log(req.body);
    let user_id = req.body.user_id;
    let event_id = req.body.event_id;
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let title = req.body.title;
    let text = req.body.text;
    let _id = req.body.uid;

    let result = await createPost(
      user_id,
      event_id,
      firstname,
      lastname,
      title,
      text,
      _id
    );

    console.log(result);
    res.json(result);
  } catch (e) {
    res.status(400).json(e);
  }
});

router.route("/:post_id").get(async (req, res) => {
  try {
    const postInfo = await getPostByPostId(req.params.post_id);
    console.log(postInfo);
    res.status(200).json(postInfo);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.route("/:post_id").delete(async (req, res) => {
  try {
    const postInfo = await removePostByPostId(req.params.post_id);
    console.log(postInfo);
    res.status(200).json(postInfo);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.route("/event/:event_id").get(async (req, res) => {
  try {
    const postList = await getPostByEventId(req.params.event_id);
    console.log(postList);
    res.status(200).json(postList);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
