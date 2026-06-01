import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/user.model.js';

const TEST_USER = {
  email:    'user@test.dev',
  password: 'pass_123',
  name:     'Test User',
};

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);

  const existing = await User.findOne({ email: TEST_USER.email }).select('+password');

  if (!existing) {
    const user = new User({
      name:       TEST_USER.name,
      email:      TEST_USER.email,
      password:   TEST_USER.password,
      isVerified: true,
    });
    await user.save();
    console.log('[seed-test-user] Created:', TEST_USER.email);
  } else {
    // Always reset password and ensure verified — guarantees test credentials match
    existing.password   = TEST_USER.password;
    existing.isVerified = true;
    await existing.save(); // pre-save hook re-hashes the password
    console.log('[seed-test-user] Password reset + verified:', TEST_USER.email);
  }

  await mongoose.disconnect();
}

run().catch(err => { console.error(err); process.exit(1); });
