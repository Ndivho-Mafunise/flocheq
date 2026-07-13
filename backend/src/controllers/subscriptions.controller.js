import { stripe } from "../config/stripe.js";
const Price_Ids = {
  starter: process.env.STRIPE_PRICE_STARTER_PLAN,
  growth: process.env.STRIPE_PRICE_GROWTH_PLAN,
  scale: process.env.STRIPE_PRICE_SCALE_PLAN,
};

export const checkoutSession = async (req, res) => {
  const { plan } = req.body;
  const priceId = Price_Ids[plan];
  if (!priceId) {
    return res.status(400).json({ error: "Invalid plan selected" });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: "http://localhost:5123/success",
      cancel_url: "http://localhost:5123/pricing",
      customer_email: user.email,
    });
    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
