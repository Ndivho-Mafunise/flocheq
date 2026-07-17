import { stripe } from "../config/stripe.js";
import User from "../models/user.model.js";

const Price_Ids = {
  starter: process.env.STRIPE_PRICE_STARTER_PLAN,
  growth: process.env.STRIPE_PRICE_GROWTH_PLAN,
  scale: process.env.STRIPE_PRICE_SCALE_PLAN,
};

const Plan_By_Price_Id = {
  [process.env.STRIPE_PRICE_STARTER_PLAN]: "starter",
  [process.env.STRIPE_PRICE_GROWTH_PLAN]: "growth",
  [process.env.STRIPE_PRICE_SCALE_PLAN]: "scale",
};

const ACTIVE_STATUSES = ["active", "trialing"];

export const checkoutSession = async (req, res) => {
  const { plan } = req.body;
  const priceId = Price_Ids[plan];
  if (!priceId) {
    return res.status(400).json({ success: false, message: "Invalid plan selected" });
  }

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (ACTIVE_STATUSES.includes(user.subscriptionStatus)) {
      return res.status(400).json({
        success: false,
        message: "You already have an active subscription. Manage it from the billing portal.",
      });
    }

    if (!user.stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: { userId: user._id.toString() },
      });
      user.stripeCustomerId = customer.id;
      await user.save();
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: user.stripeCustomerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.CLIENT_URL}/billing?checkout=success`,
      cancel_url: `${process.env.CLIENT_URL}/subscriptions?checkout=cancelled`,
      metadata: { userId: user._id.toString(), plan },
    });

    res.json({ success: true, url: session.url });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const portalSession = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user?.stripeCustomerId) {
      return res.status(400).json({ success: false, message: "No billing account found for this user" });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${process.env.CLIENT_URL}/billing`,
    });

    res.json({ success: true, url: session.url });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select(
      "plan subscriptionStatus currentPeriodStart currentPeriodEnd stripeCustomerId",
    );
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      data: {
        plan: user.plan,
        status: user.subscriptionStatus,
        currentPeriodStart: user.currentPeriodStart,
        currentPeriodEnd: user.currentPeriodEnd,
        hasBillingAccount: Boolean(user.stripeCustomerId),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

async function syncSubscription(customerId, subscription) {
  // current_period_start/end live on the subscription item, not the
  // subscription itself, as of the account's Stripe API version.
  const item = subscription.items.data[0];
  const plan = Plan_By_Price_Id[item?.price?.id] ?? "free";

  await User.findOneAndUpdate(
    { stripeCustomerId: customerId },
    {
      plan,
      subscriptionStatus: subscription.status,
      stripeSubscriptionId: subscription.id,
      currentPeriodStart: new Date(item.current_period_start * 1000),
      currentPeriodEnd: new Date(item.current_period_end * 1000),
    },
  );
}

export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        if (session.mode === "subscription" && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(session.subscription);
          await syncSubscription(session.customer, subscription);
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object;
        await syncSubscription(subscription.customer, subscription);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        await User.findOneAndUpdate(
          { stripeCustomerId: subscription.customer },
          {
            plan: "free",
            subscriptionStatus: "canceled",
            stripeSubscriptionId: null,
            currentPeriodStart: null,
            currentPeriodEnd: null,
          },
        );
        break;
      }

      default:
        break;
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Webhook handling error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
