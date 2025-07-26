const express = require("express");
const { supabase } = require("../supabase");

const router = express.Router();

router.get("/", async (_req, res) => {
  const { data, error } = await supabase.from("monitored_sites").select("*");
  if (error) return res.status(500).json(error);
  res.json(data);
});

router.post("/", async (req, res) => {
  const { url, name } = req.body;
  const { data, error } = await supabase
    .from("monitored_sites")
    .insert([{ url, name }])
    .select();

  if (error) return res.status(500).json(error);
  res.json(data);
});

module.exports = router;
