import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDB } from "./db";
import { Customer, Consultation, Task, FollowUp, Remedy, Notification } from "./models";
import {
  customers,
  consultations,
  panditTasks,
  followUps,
  remedies,
  notifications,
} from "./mock-data";

dotenv.config();

async function seed() {
  await connectDB();
  console.log("🌱 Connected to database, starting seed...");

  try {
    await Customer.deleteMany({});
    await Consultation.deleteMany({});
    await Task.deleteMany({});
    await FollowUp.deleteMany({});
    await Remedy.deleteMany({});
    await Notification.deleteMany({});
    console.log("Cleared existing data.");

    await Customer.insertMany(customers);
    await Consultation.insertMany(consultations);
    await Task.insertMany(panditTasks);
    await FollowUp.insertMany(followUps);
    await Remedy.insertMany(remedies);
    await Notification.insertMany(notifications);
    console.log("✅ Seed completed successfully!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
}

seed();
