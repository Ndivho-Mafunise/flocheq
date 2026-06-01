import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backendDir = path.resolve(__dirname, '../backend');

export default async function globalSetup() {
  console.log('[global-setup] Seeding test user...');
  execSync('node src/seeds/seed-test-user.js', {
    cwd:   backendDir,
    stdio: 'inherit',
  });
}
