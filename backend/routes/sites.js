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

router.get("/:id/logs", async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "Missing site ID" });

  const { data, error } = await supabase
    .from("monitoring_logs")
    .select("*")
    .eq("site_id", id)
    .order("checked_at", { ascending: false })
    .limit(1);

  if (error) return res.status(500).json(error);
  if (!data || data.length === 0)
    return res.status(404).json({ message: "No logs found" });

  res.json(data);
});

module.exports = router;
