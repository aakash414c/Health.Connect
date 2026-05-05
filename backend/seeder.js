/**
 * Default seed script
 * Usage: node seeder.js
 *
 * Creates the initial admin, patient, and doctor users if they do not exist.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Doctor from './models/Doctor.js';

dotenv.config();

const ACCOUNTS = [
  {
    name: 'Admin',
    email: 'admin@healthconnect.com',
    password: 'Admin@123456',
    role: 'admin',
  },
  {
    name: 'Patient User',
    email: 'patient@healthconnect.com',
    password: 'Patient@123',
    role: 'patient',
  },
  {
    name: 'Doctor User',
    email: 'doctor@healthconnect.com',
    password: 'Doctor@123',
    role: 'doctor',
  },
];

const DEFAULT_DOCTOR_PROFILE = {
  specialization: 'General Medicine',
  experience: 8,
  consultationFee: 500,
  availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  availableTiming: { start: '09:00', end: '17:00' },
  slotDuration: 30,
  about: 'This is a seeded doctor profile for testing purposes.',
  licenseNumber: 'LIC-000123',
  hospitalAffiliation: 'HealthConnect Medical Center',
  verificationStatus: 'approved',
  verified: true,
};

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    for (const account of ACCOUNTS) {
      const existing = await User.findOne({ email: account.email });
      if (existing) {
        console.log(`ℹ️  ${account.role} already exists: ${account.email}`);
        continue;
      }

      await User.create(account);
      console.log(`✅ Created ${account.role}: ${account.email}`);
    }

    const doctorUser = await User.findOne({ email: 'doctor@healthconnect.com' });
    if (doctorUser) {
      const existingProfile = await Doctor.findOne({ userId: doctorUser._id });
      if (!existingProfile) {
        await Doctor.create({
          userId: doctorUser._id,
          ...DEFAULT_DOCTOR_PROFILE,
        });
        console.log('✅ Created default doctor profile for doctor@healthconnect.com');
      } else {
        console.log('ℹ️  Doctor profile already exists for doctor@healthconnect.com');
      }
    }

    console.log('\n🎉 Seed completed!');
    console.log('─────────────────────────────────');
    console.log('   Admin:   admin@healthconnect.com / Admin@123456');
    console.log('   Patient: patient@healthconnect.com / Patient@123');
    console.log('   Doctor:  doctor@healthconnect.com / Doctor@123');
    console.log('─────────────────────────────────');
    console.log('⚠️  Change these credentials after initial testing.\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeder error:', error.message);
    process.exit(1);
  }
};

seed();
