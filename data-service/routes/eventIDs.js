import express from "express";
import { spawn } from "child_process";

const router = express.Router();

router.post("/", async (req, res) => {
  // get the request body
  const data = req.body;
  if (!data || Object.keys(data).length === 0) {
    return res
      .status(400)
      .json({ error: "There are no fields in the request body" });
  }
  try {
    const pages = data.pages;
    const date = data.date;
    const state = data.state;
    const city = data.city;

    const python = spawn("python3", [
      "../data-service/data/EventIDCrawler.py",
      pages,
      date,
      state,
      city,
    ]);

    python.stdout.on("data", (data) => {
      const eventIDs = JSON.parse(data);
      return res.status(200).json({ eventIDs });
    });

    python.stderr.on("data", (err) => {
      console.log(String(err));
    });

    python.on("close", (code) => {
      console.log("child process exited with code ", code);
    });
  } catch (e) {
    res.status(400).json(e);
  }
});

export default router;
