const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
const User = require("../models/User");
const SeedPackage = require("../models/SeedPackage");
const Order = require("../models/Order");

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
    let event;
    console.log("hello I am runnin");
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      console.log("event", event);
    } catch (err) {
      console.error("Webhook error:", err.message);
      return res.status(400).send(`Webhook error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      console.log("session", session);
      try {
        const userId = session.metadata.userId;
        console.log("session.metadata", session.metadata);
        const user = await User.findById(userId);

        if (!user) {
          throw new Error("User not found");
        }

        const seedPackageId = session.metadata.seedPackageId;
        const seedPackage = await SeedPackage.findById(seedPackageId);

        if (!seedPackage) {
          throw new Error("Seed package not found");
        }

        const orderId = session.metadata.orderId;
        const order = await Order.findById(orderId);

        if (!order) {
          throw new Error("Order not found");
        }

        // Update user's goldenSeeds and orders
        user.goldenSeeds += seedPackage.quantity;
        user.orders.push(orderId);

        // Update the order status to completed
        order.status = "completed";

        await user.save();
        await order.save();
      } catch (error) {
        console.error("Error handling checkout session completion:", error);
      }
    }

    res.json({ received: true });
  }
);

module.exports = router;
