import express from "express";
import polls from "../data/polls.js";

const router = express.Router();

router
  .route("/:id")
  .get(async (req, res) => {
    try {
      let pollCollection = polls();

      let data = await pollCollection.get();
      res.status(200).json(data);
    } catch (error) {
      res.status(400).json(error);
    }
  })
  .post(async (req, res) => {
    // get the request body
    const data = req.body;
    if (!data || Object.keys(data).length === 0) {
      return res
        .status(400)
        .json({ error: "There are no fields in the request body" });
    }
    try {
    } catch (e) {
      res.status(400).json(e);
    }
  });

export default router;
