import express from "express";
import favorite from "../favorite";

const router = express.Router();

router.post("/add", async (req, res) => {
  try {
    const fav = await favorite.create(req.body);
    res.json(fav);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:userId", async (req, res) => {
  const favs = await favorite.find({ userId: req.params.userId });
  res.json(favs);
});

export default router;
