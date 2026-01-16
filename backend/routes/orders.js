router.post("/orders", verifyToken, async (req, res) => {
  try {
    const { date, foodType, paymentType } = req.body;

    if (!date || !foodType || !paymentType) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // ✅ SAVE ORDER
    await Order.create({
      userId: req.userId,
      date,
      foodType,
      paymentType
    });

    // ✅ SEND WHATSAPP TO BOSSES
    const message =
      `📦 New Order\n` +
      `Date: ${date}\n` +
      `Food: ${foodType}\n` +
      `Payment: ${paymentType}`;

    for (const number of BOSS_WHATSAPP_NUMBERS) {
      await client.messages.create({
        from: TWILIO_WHATSAPP_FROM,
        to: number,
        body: message
      });
    }

    res.json({ msg: "Order saved & boss notified" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});
