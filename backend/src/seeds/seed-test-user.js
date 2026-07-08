import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/user.model.js';

const TEST_USERS = [
  { email: 'user@test.dev',  password: 'pass_123',     name: 'Test User',  role: 'user'  },
  { email: 'admin@test.dev', password: 'DemoPass123!', name: 'Test Admin', role: 'admin' },
  { email: 'guest@test.dev', password: 'DemoPass123!', name: 'Test Guest', role: 'guest' },
];

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);

  for (const testUser of TEST_USERS) {
    const existing = await User.findOne({ email: testUser.email }).select('+password');

    if (!existing) {
      const user = new User({
        name:       testUser.name,
        email:      testUser.email,
        password:   testUser.password,
        role:       testUser.role,
        isVerified: true,
      });
      await user.save();
      console.log('[seed-test-user] Created:', testUser.email, `(${testUser.role})`);
    } else {
      // Always reset password and ensure verified — guarantees test credentials match
      existing.password   = testUser.password;
      existing.role       = testUser.role;
      existing.isVerified = true;
      await existing.save(); // pre-save hook re-hashes the password
      console.log('[seed-test-user] Password reset + verified:', testUser.email, `(${testUser.role})`);
    }
  }

  await mongoose.disconnect();
}

run().catch(err => { console.error(err); process.exit(1); });
