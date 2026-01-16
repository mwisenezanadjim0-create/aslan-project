const express = require("express");
const router = express.Router();

router.post("/create", (req, res) => {
  const { orderName, amount, phone } = req.body;

  console.log("💰 Payment request received:", {
    orderName,
    amount,
    phone
  });

  res.json({
    success: true,
    message: "Payment request created"
  });
});

module.exports = router;
