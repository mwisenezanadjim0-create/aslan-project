const express = require("express");
const router = express.Router();
const DailyReport = require("../models/dailyreport");

// SAVE REPORT
router.post("/add", async (req, res) => {
  try {
    const report = new DailyReport(req.body);
    await report.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// GET REPORTS PER USER
router.get("/:email", async (req, res) => {
  const reports = await DailyReport.find({ email: req.params.email });
  res.json(reports);
});

module.exports = router;
