// seed.js — populate the database with realistic dev-business sample data.
// Run once from the backend folder:  node src/seeds/seed.js
// Clears all existing Customer and Transaction data first.

import "dotenv/config";
import connectDB     from "../config/database.js";
import Customer      from "../models/customer.model.js";
import Transaction   from "../models/transaction.model.js";

// ─────────────────────────────────────────────────────────────────────────────
// Clients – realistic mix for a solo software developer
// ─────────────────────────────────────────────────────────────────────────────
const clients = [
  { name: "Acme Corp",         email: "billing@acmecorp.com",      plan: "enterprise", acquisitionChannel: "referral", status: "active"  },
  { name: "StartupXYZ",        email: "pay@startupxyz.io",         plan: "pro",        acquisitionChannel: "organic",  status: "active"  },
  { name: "Digital Agency Co", email: "accounts@dagency.com",      plan: "pro",        acquisitionChannel: "referral", status: "churned" },
  { name: "Maria Santos",      email: "maria@designstudio.co",     plan: "starter",    acquisitionChannel: "organic",  status: "active"  },
  { name: "Tom Bradley",       email: "tom.b@personal.com",        plan: "free",       acquisitionChannel: "direct",   status: "active"  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Transaction templates per plan
// ─────────────────────────────────────────────────────────────────────────────
const txProfiles = {
  enterprise: {
    count: 10,
    rows: [
      { type: "subscription", description: "Enterprise Retainer – Monthly",     min: 2500, max: 4000 },
      { type: "service",      description: "Custom Feature Development",         min: 3000, max: 8000 },
      { type: "service",      description: "Architecture Consultation",          min: 1500, max: 3000 },
      { type: "product",      description: "White-label Dashboard License",      min: 800,  max: 1500 },
    ],
  },
  pro: {
    count: 6,
    rows: [
      { type: "subscription", description: "Pro Plan – Monthly",                min: 299,  max: 499  },
      { type: "service",      description: "UI/UX Design Sprint",               min: 600,  max: 1200 },
      { type: "product",      description: "Plugin License – Annual",           min: 149,  max: 299  },
    ],
  },
  starter: {
    count: 3,
    rows: [
      { type: "subscription", description: "Starter Plan – Monthly",            min: 49,   max: 99   },
      { type: "product",      description: "Component Library License",         min: 29,   max: 79   },
    ],
  },
  free: { count: 0, rows: [] },
};

function rand(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function buildTransactions(customers) {
  const txs = [];
  const now  = new Date();

  for (const customer of customers) {
    const profile = txProfiles[customer.plan];
    if (!profile || profile.count === 0) continue;

    for (let i = 0; i < profile.count; i++) {
      const template  = profile.rows[i % profile.rows.length];
      const monthsAgo = i % 12;
      const date      = new Date(now.getFullYear(), now.getMonth() - monthsAgo, rand(1, 28));

      // ~85 % paid, ~10 % pending, ~5 % failed
      const r      = rand(1, 20);
      const status = r === 1 ? "failed" : r <= 3 ? "pending" : "paid";
      const amount = rand(template.min, template.max);

      txs.push({
        customer:     customer._id,
        customerName: customer.name,
        amount,
        type:         template.type,
        status,
        description:  template.description,
        date,
      });
    }
  }

  return txs;
}

async function seed() {
  await connectDB();

  console.log("Clearing existing data…");
  await Promise.all([Customer.deleteMany({}), Transaction.deleteMany({})]);

  console.log("Inserting clients…");
  const insertedClients = await Customer.insertMany(
    clients.map((c) => ({ ...c, ltv: 0 }))
  );

  console.log("Inserting transactions…");
  const txs = buildTransactions(insertedClients);
  await Transaction.insertMany(txs);

  // Recalculate each client's LTV from paid transactions
  console.log("Recalculating LTV…");
  const ltvData = await Transaction.aggregate([
    { $match: { status: "paid" } },
    { $group: { _id: "$customer", total: { $sum: "$amount" } } },
  ]);

  if (ltvData.length) {
    await Customer.bulkWrite(
      ltvData.map(({ _id, total }) => ({
        updateOne: { filter: { _id }, update: { $set: { ltv: total } } },
      }))
    );
  }

  console.log(`\nDone!  ${insertedClients.length} clients · ${txs.length} transactions\n`);
  process.exit(0);
}

seed().catch((err) => { console.error("Seed failed:", err); process.exit(1); });
