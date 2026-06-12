import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./db";
import { Customer, Consultation, Task, FollowUp, Remedy, Notification } from "./models";
import { streamText, convertToModelMessages } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

dotenv.config();

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  credentials: true
}));
app.use(express.json());

// Basic health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/", (req, res) => {
  res.send("AstroCRM Backend is running! 🚀");
});

/* ── Customers ────────────────────────────────────────────── */
app.get("/api/customers", async (req, res) => {
  try {
    const { q, status } = req.query;
    let query: any = {};
    if (status && status !== "all") query.status = status;
    if (q) {
      query.$or = [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
        { phone: { $regex: q, $options: "i" } },
      ];
    }
    const customers = await Customer.find(query).sort({ createdAt: -1 });
    // Transform _id to id
    res.json(customers.map(c => ({ ...c.toObject(), id: c._id })));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/customers", async (req, res) => {
  try {
    const customer = new Customer(req.body);
    await customer.save();
    res.json({ ...customer.toObject(), id: customer._id });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/customers/:id", async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    res.json({ ...customer.toObject(), id: customer._id });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/customers/:id", async (req, res) => {
  try {
    await Customer.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/* ── Consultations ────────────────────────────────────────── */
app.get("/api/consultations", async (req, res) => {
  try {
    const consultations = await Consultation.find().sort({ createdAt: -1 });
    res.json(consultations.map(c => ({ ...c.toObject(), id: c._id })));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/consultations", async (req, res) => {
  try {
    const consultation = new Consultation(req.body);
    await consultation.save();
    res.json({ ...consultation.toObject(), id: consultation._id });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/* ── Tasks ────────────────────────────────────────────────── */
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks.map(t => ({ ...t.toObject(), id: t._id })));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/tasks", async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.json({ ...task.toObject(), id: task._id });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json({ ...task.toObject(), id: task._id });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/* ── Follow-Ups ───────────────────────────────────────────── */
app.get("/api/followups", async (req, res) => {
  try {
    const followups = await FollowUp.find().sort({ createdAt: -1 });
    res.json(followups.map(f => ({ ...f.toObject(), id: f._id })));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/followups", async (req, res) => {
  try {
    const followup = new FollowUp(req.body);
    await followup.save();
    res.json({ ...followup.toObject(), id: followup._id });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/followups/:id", async (req, res) => {
  try {
    const followup = await FollowUp.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!followup) return res.status(404).json({ error: "Follow-up not found" });
    res.json({ ...followup.toObject(), id: followup._id });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/* ── Remedies ─────────────────────────────────────────────── */
app.get("/api/remedies", async (req, res) => {
  try {
    const remedies = await Remedy.find().sort({ createdAt: -1 });
    res.json(remedies.map(r => ({ ...r.toObject(), id: r._id })));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/remedies", async (req, res) => {
  try {
    const remedy = new Remedy(req.body);
    await remedy.save();
    res.json({ ...remedy.toObject(), id: remedy._id });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/* ── Notifications ────────────────────────────────────────── */
app.get("/api/notifications", async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json(notifications.map(n => ({ ...n.toObject(), id: n._id })));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/notifications", async (req, res) => {
  try {
    // mark all as read
    await Notification.updateMany({}, { read: true });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/notifications/:id", async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    if (!notification) return res.status(404).json({ error: "Notification not found" });
    res.json({ ...notification.toObject(), id: notification._id });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/* ── Chat (Gemini) ────────────────────────────────────────── */
const SYSTEM_PROMPT = `You are Jyotish AI, the in-app assistant for "Humara Pandit", a premium CRM used by Vedic astrologers and pandits.
You help astrologers and admins with:
- Drafting consultation notes and summaries
- Suggesting gemstones, rudraksha and remedies for planetary doshas
- Writing warm, professional follow-up messages to customers
- General Vedic astrology guidance (kundli, doshas, muhurat, nakshatras)
- CRM workflow advice (managing customers, consultations, follow-ups, tasks)

Be concise, warm and practical. Use light formatting and the occasional relevant emoji.
Always answer the user's actual question. If asked about something outside astrology or the CRM, still be helpful.`;

app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages are required" });
    }

    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      return res.status(500).json({ error: "GEMINI_API_KEY environment variable is missing" });
    }

    const google = createGoogleGenerativeAI({ apiKey: key });
    const model = google("gemini-2.5-flash");

    // Manually map to CoreMessages
    const coreMessages = messages.map((m: any) => ({
      role: m.role || "user",
      content: m.content || m.parts?.map((p: any) => p.text).join("") || "",
    }));

    const result = streamText({
      model,
      system: SYSTEM_PROMPT,
      messages: coreMessages,
    });

    result.pipeUIMessageStreamToResponse(res);
  } catch (error: any) {
    console.error("Error in chat route:", error.stack || error);
    res.status(500).json({ error: error.message || "Error" });
  }
});

/* ── Start Server ─────────────────────────────────────────── */
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  console.log("✅ Connected to MongoDB");
  app.listen(PORT, () => {
    console.log(`🚀 Backend server running on port ${PORT}`);
  });
}).catch(err => {
  console.error("❌ MongoDB connection error:", err);
  process.exit(1);
});
