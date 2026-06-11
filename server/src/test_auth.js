import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { getDb, initDb } from './db.js';

async function runTest() {
  console.log('--- Starting Authentication Test ---');
  await initDb();
  const db = await getDb();

  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = 'Password123';
  const testName = 'Test User';

  console.log(`\n1. Testing Signup for email: ${testEmail}`);
  try {
    // Check if user already exists
    const existingUser = await db.get('SELECT * FROM users WHERE email = ?', [testEmail]);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(testPassword, salt);
    const userId = crypto.randomUUID();

    // Insert
    await db.run(
      `INSERT INTO users (
        id, name, email, password_hash, academic_level, academic_marks, academic_stream, career_goal, college_type, budget, location
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        testName,
        testEmail.toLowerCase(),
        passwordHash,
        'PUC',
        95.5,
        'Science',
        'Software Engineer',
        'Government',
        150000,
        'Bangalore'
      ]
    );

    // Insert interests
    const interests = ['coding', 'ai'];
    const stmt = await db.prepare('INSERT INTO interests (user_id, interest_id) VALUES (?, ?)');
    for (const interest of interests) {
      await stmt.run([userId, interest]);
    }
    await stmt.finalize();

    console.log('Signup database write successful!');

    // Fetch user back
    const userRow = await db.get('SELECT * FROM users WHERE id = ?', [userId]);
    const interestsRows = await db.all('SELECT interest_id FROM interests WHERE user_id = ?', [userId]);
    console.log('User retrieved from DB:', {
      ...userRow,
      password_hash: '[REDACTED]',
      interests: interestsRows.map(r => r.interest_id)
    });
  } catch (error) {
    console.error('Signup test failed:', error);
    process.exit(1);
  }

  console.log(`\n2. Testing Login for email: ${testEmail}`);
  try {
    const user = await db.get('SELECT * FROM users WHERE email = ?', [testEmail]);
    if (!user) {
      throw new Error('User not found in DB during login test');
    }

    const isMatch = await bcrypt.compare(testPassword, user.password_hash);
    if (!isMatch) {
      throw new Error('Password mismatch');
    }

    console.log('Login match successful!');
  } catch (error) {
    console.error('Login test failed:', error);
    process.exit(1);
  }

  console.log('\n--- All Authentication Tests Passed Successfully! ---');
  process.exit(0);
}

runTest();
