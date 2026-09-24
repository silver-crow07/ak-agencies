/**
 * One-time admin setup script for AK Agencies.
 *
 * Usage:
 *   npx tsx prisma/setup-admin.ts <email>
 *
 * Password input (choose one):
 *   - Interactive prompt (stdin) — default when ADMIN_PASSWORD is not set
 *   - ADMIN_PASSWORD env var      — for scripted/CI usage
 *
 * Behavior:
 *   - If no user exists with the given email → creates a new ADMIN user
 *   - If a CUSTOMER user exists with the given email → promotes to ADMIN
 *   - If an ADMIN user already exists → exits cleanly (idempotent)
 *
 * Security:
 *   - Password is NEVER printed or logged
 *   - Interactive prompt uses raw-mode input (no echo)
 *   - Script is local-only, not exposed via any API route
 */

import { PrismaClient, Prisma } from '@prisma/client';
import * as readline from 'readline';

const prisma = new PrismaClient();

// ─── Helpers ──────────────────────────────────────────────────

function readStdinPassword(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    // Suppress echo for password input
    process.stdin.setRawMode?.(true);
    process.stdin.resume();
    process.stdin.setEncoding('utf8');

    process.stdout.write(prompt);

    let password = '';

    process.stdin.on('data', (chunk: string) => {
      for (const char of chunk) {
        if (char === '\n' || char === '\r' || char === '\u0004') {
          // Enter or Ctrl-D — finish
          process.stdout.write('\n');
          process.stdin.setRawMode?.(false);
          process.stdin.pause();
          rl.close();
          resolve(password);
          return;
        }
        if (char === '\u007F' || char === '\b') {
          // Backspace
          if (password.length > 0) {
            password = password.slice(0, -1);
          }
        } else {
          password += char;
          // Print asterisk for each character
          process.stdout.write('*');
        }
      }
    });
  });
}

function hashPassword(password: string): Promise<string> {
  // Use bcryptjs — same as the rest of the app
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const bcrypt = require('bcryptjs') as typeof import('bcryptjs');
  return bcrypt.hash(password, 12);
}

// ─── Main ─────────────────────────────────────────────────────

async function main() {
  const email = process.argv[2]?.toLowerCase().trim();

  if (!email || !email.includes('@')) {
    console.error('Usage: npx tsx prisma/setup-admin.ts <email>');
    console.error('Example: npx tsx prisma/setup-admin.ts admin@akagencies.com');
    process.exit(1);
  }

  // Get password: env var or interactive prompt
  let password = process.env.ADMIN_PASSWORD;
  if (!password) {
    password = await readStdinPassword('Enter admin password: ');
  }

  if (password.length < 8) {
    console.error('Password must be at least 8 characters.');
    process.exit(1);
  }

  // Hash password
  const passwordHash = await hashPassword(password);

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true, name: true, role: true },
  });

  if (existingUser) {
    if (existingUser.role === 'ADMIN') {
      console.log(`✓ User ${email} is already an ADMIN. No changes needed.`);
      await prisma.$disconnect();
      return;
    }

    // Promote existing CUSTOMER to ADMIN
    await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        role: 'ADMIN',
        passwordHash, // Update password too
      },
    });

    console.log(`✓ Promoted "${existingUser.name}" (${email}) from ${existingUser.role} → ADMIN`);
    console.log(`  Password has been updated.`);
  } else {
    // Create new ADMIN user
    const name = email.split('@')[0];
    await prisma.user.create({
      data: {
        name: name.charAt(0).toUpperCase() + name.slice(1),
        email,
        passwordHash,
        role: 'ADMIN',
      },
    });

    console.log(`✓ Created new ADMIN user: ${email}`);
  }

  console.log(`\nYou can now log in at /admin/login`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error('Failed:', e.message);
  process.exit(1);
});
