import mongoose, { Schema, type InferSchemaType } from "mongoose";

/* ── Customers ────────────────────────────────────────────── */
const customerSchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    zodiac: { type: String, default: "Aries" },
    nakshatra: { type: String, default: "Ashwini" },
    birthDate: { type: String, default: "" },
    birthTime: { type: String, default: "" },
    birthPlace: { type: String, default: "" },
    status: { type: String, enum: ["Active", "Lead", "Inactive"], default: "Lead" },
    lastConsultation: { type: String, default: "—" },
    score: { type: Number, default: 60 },
    avatarHue: { type: Number, default: 0 },
  },
  { timestamps: true },
);

/* ── Consultations ────────────────────────────────────────── */
const consultationSchema = new Schema(
  {
    customerId: { type: String, default: "" },
    customer: { type: String, required: true },
    astrologer: { type: String, required: true },
    topic: { type: String, required: true },
    status: { type: String, enum: ["Lead", "Scheduled", "Completed", "Follow-Up"], default: "Lead" },
    date: { type: String, default: "" },
    time: { type: String, default: "" },
    amount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

/* ── Tasks ────────────────────────────────────────────────── */
const taskSchema = new Schema(
  {
    title: { type: String, required: true },
    detail: { type: String, default: "" },
    customer: { type: String, required: true },
    priority: { type: String, enum: ["High", "Medium", "Low"], default: "Medium" },
    status: { type: String, enum: ["To Do", "In Progress", "Done"], default: "To Do" },
    due: { type: String, default: "" },
  },
  { timestamps: true },
);

/* ── Follow-Ups ───────────────────────────────────────────── */
const followUpSchema = new Schema(
  {
    customer: { type: String, required: true },
    customerId: { type: String, default: "" },
    note: { type: String, required: true },
    due: { type: String, default: "" },
    stage: { type: String, enum: ["Upcoming", "Scheduled", "Missed", "Done"], default: "Upcoming" },
    astrologer: { type: String, default: "" },
  },
  { timestamps: true },
);

/* ── Remedies ─────────────────────────────────────────────── */
const remedySchema = new Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ["Gemstone", "Rudraksha", "Yantra", "Spiritual Remedy"], required: true },
    description: { type: String, default: "" },
    benefits: { type: [String], default: [] },
    reason: { type: String, default: "" },
    price: { type: Number, default: 0 },
    emoji: { type: String, default: "✨" },
  },
  { timestamps: true },
);

/* ── Notifications ────────────────────────────────────────── */
const notificationSchema = new Schema(
  {
    type: { type: String, enum: ["consultation", "followup", "customer", "reminder"], required: true },
    title: { type: String, required: true },
    body: { type: String, default: "" },
    time: { type: String, default: "" },
    read: { type: Boolean, default: false },
  },
  { timestamps: true },
);

/* ── Export models (handle hot-reload re-registration) ───── */
export const Customer =
  mongoose.models.Customer || mongoose.model("Customer", customerSchema);

export const Consultation =
  mongoose.models.Consultation || mongoose.model("Consultation", consultationSchema);

export const Task =
  mongoose.models.Task || mongoose.model("Task", taskSchema);

export const FollowUp =
  mongoose.models.FollowUp || mongoose.model("FollowUp", followUpSchema);

export const Remedy =
  mongoose.models.Remedy || mongoose.model("Remedy", remedySchema);

export const Notification =
  mongoose.models.Notification || mongoose.model("Notification", notificationSchema);
