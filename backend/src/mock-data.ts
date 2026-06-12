export type ConsultationStatus = "Lead" | "Scheduled" | "Completed" | "Follow-Up";
export type CustomerStatus = "Active" | "Lead" | "Inactive";
export type FollowUpStage = "Upcoming" | "Scheduled" | "Missed" | "Done";

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  zodiac: string;
  nakshatra: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  status: CustomerStatus;
  lastConsultation: string;
  score: number;
  avatarHue: number;
}

export interface Consultation {
  id: string;
  customerId: string;
  customer: string;
  astrologer: string;
  topic: string;
  status: ConsultationStatus;
  date: string;
  time: string;
  amount: number;
}

export interface Remedy {
  id: string;
  name: string;
  type: "Gemstone" | "Rudraksha" | "Yantra" | "Spiritual Remedy";
  description: string;
  benefits: string[];
  reason: string;
  price: number;
  emoji: string;
}

export interface FollowUp {
  id: string;
  customer: string;
  customerId: string;
  note: string;
  due: string;
  stage: FollowUpStage;
  astrologer: string;
}

export interface Astrologer {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  consultations: number;
  revenue: number;
  avatarHue: number;
}

export interface Notification {
  id: string;
  type: "consultation" | "followup" | "customer" | "reminder";
  title: string;
  body: string;
  time: string;
  read: boolean;
}

export interface ActivityItem {
  id: string;
  actor: string;
  action: string;
  target: string;
  time: string;
}

const zodiacs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
const nakshatras = ["Ashwini", "Rohini", "Magha", "Chitra", "Anuradha", "Shravana", "Revati", "Pushya"];

export const astrologers: Astrologer[] = [
  { id: "a1", name: "Pandit Raghav Shastri", specialty: "Vedic & Kundli", rating: 4.9, consultations: 412, revenue: 684000, avatarHue: 280 },
  { id: "a2", name: "Acharya Meera Joshi", specialty: "Gemstone & Remedies", rating: 4.8, consultations: 356, revenue: 591000, avatarHue: 320 },
  { id: "a3", name: "Guru Aditya Nath", specialty: "Numerology & Vastu", rating: 4.7, consultations: 298, revenue: 472000, avatarHue: 200 },
  { id: "a4", name: "Pandit Vinay Tripathi", specialty: "Tarot & Palmistry", rating: 4.6, consultations: 244, revenue: 388000, avatarHue: 150 },
  { id: "a5", name: "Acharya Sneha Rao", specialty: "Marriage & Career", rating: 4.8, consultations: 331, revenue: 540000, avatarHue: 40 },
];

const firstNames = ["Aarav", "Diya", "Kabir", "Ananya", "Vivaan", "Ishita", "Arjun", "Sara", "Reyansh", "Myra", "Aditya", "Kiara", "Rohan", "Tara", "Dev", "Naina", "Karan", "Pooja", "Manish", "Riya"];
const lastNames = ["Sharma", "Verma", "Patel", "Gupta", "Singh", "Reddy", "Nair", "Iyer", "Mehta", "Kapoor"];

function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length];
}

export const customers: Customer[] = Array.from({ length: 28 }).map((_, i) => {
  const name = `${pick(firstNames, i)} ${pick(lastNames, i * 3 + 1)}`;
  const statuses: CustomerStatus[] = ["Active", "Lead", "Inactive"];
  return {
    id: `c${i + 1}`,
    name,
    phone: `+91 9${(800000000 + i * 13731).toString().slice(0, 9)}`,
    email: `${name.toLowerCase().replace(/\s/g, ".")}@gmail.com`,
    zodiac: pick(zodiacs, i),
    nakshatra: pick(nakshatras, i),
    birthDate: `19${85 + (i % 15)}-0${(i % 9) + 1}-1${i % 9}`,
    birthTime: `${(i % 12) + 1}:${(i * 7) % 60 < 10 ? "0" : ""}${(i * 7) % 60} ${i % 2 ? "AM" : "PM"}`,
    birthPlace: pick(["Delhi", "Mumbai", "Jaipur", "Pune", "Lucknow", "Varanasi", "Bengaluru", "Indore"], i),
    status: pick(statuses, i),
    lastConsultation: `2026-0${(i % 6) + 1}-${10 + (i % 18)}`,
    score: 55 + ((i * 7) % 45),
    avatarHue: (i * 37) % 360,
  };
});

const topics = ["Career Growth", "Marriage Match", "Health Remedy", "Business Vastu", "Kundli Reading", "Gemstone Advice", "Child Future", "Property Decision"];

export const consultations: Consultation[] = Array.from({ length: 24 }).map((_, i) => {
  const c = pick(customers, i * 2);
  const statuses: ConsultationStatus[] = ["Lead", "Scheduled", "Completed", "Follow-Up"];
  return {
    id: `cn${i + 1}`,
    customerId: c.id,
    customer: c.name,
    astrologer: pick(astrologers, i).name,
    topic: pick(topics, i),
    status: pick(statuses, i),
    date: `2026-06-${(i % 27) + 1 < 10 ? "0" : ""}${(i % 27) + 1}`,
    time: `${(i % 10) + 9}:00 ${i % 2 ? "AM" : "PM"}`,
    amount: 1100 + (i % 8) * 700,
  };
});

export const remedies: Remedy[] = [
  { id: "r1", name: "Yellow Sapphire (Pukhraj)", type: "Gemstone", emoji: "💛", price: 18500, description: "Powerful Jupiter stone for wisdom, prosperity and marital harmony.", benefits: ["Enhances wealth", "Improves focus", "Strengthens Jupiter"], reason: "Recommended for weak Jupiter in 7th house." },
  { id: "r2", name: "Blue Sapphire (Neelam)", type: "Gemstone", emoji: "💙", price: 26000, description: "Saturn's stone for rapid success, discipline and protection.", benefits: ["Career growth", "Removes obstacles", "Mental clarity"], reason: "Strong Saturn period (Sade Sati) support." },
  { id: "r3", name: "5 Mukhi Rudraksha", type: "Rudraksha", emoji: "📿", price: 1200, description: "Most sacred bead for peace, health and spiritual growth.", benefits: ["Reduces stress", "Balances chakras", "Better sleep"], reason: "Calms anxiety and stabilizes mind." },
  { id: "r4", name: "Shree Yantra", type: "Yantra", emoji: "🔱", price: 3500, description: "Sacred geometry for abundance, prosperity and positive energy.", benefits: ["Attracts wealth", "Home harmony", "Removes negativity"], reason: "Boosts financial flow at home/office." },
  { id: "r5", name: "Emerald (Panna)", type: "Gemstone", emoji: "💚", price: 21000, description: "Mercury's stone for intellect, communication and business acumen.", benefits: ["Sharper mind", "Business success", "Better speech"], reason: "Supports Mercury for business clients." },
  { id: "r6", name: "Mahamrityunjaya Jaap", type: "Spiritual Remedy", emoji: "🕉️", price: 5100, description: "Powerful Vedic mantra ritual for health, longevity and protection.", benefits: ["Healing energy", "Protection", "Inner strength"], reason: "Recommended during health affliction." },
  { id: "r7", name: "Red Coral (Moonga)", type: "Gemstone", emoji: "❤️", price: 9500, description: "Mars stone for courage, energy and victory over enemies.", benefits: ["Boosts confidence", "Physical strength", "Leadership"], reason: "Strengthens weak Mars for career drive." },
  { id: "r8", name: "1 Mukhi Rudraksha", type: "Rudraksha", emoji: "🪬", price: 8800, description: "Rarest bead representing Lord Shiva for ultimate consciousness.", benefits: ["Spiritual awakening", "Focus", "Detachment"], reason: "For deep meditation seekers." },
];

export const followUps: FollowUp[] = [
  { id: "f1", customer: "Aarav Sharma", customerId: "c1", note: "Check gemstone wearing results", due: "2026-06-12", stage: "Upcoming", astrologer: "Pandit Raghav Shastri" },
  { id: "f2", customer: "Diya Verma", customerId: "c2", note: "Send marriage muhurat dates", due: "2026-06-13", stage: "Upcoming", astrologer: "Acharya Sneha Rao" },
  { id: "f3", customer: "Kabir Patel", customerId: "c3", note: "Confirm pooja booking", due: "2026-06-09", stage: "Missed", astrologer: "Acharya Meera Joshi" },
  { id: "f4", customer: "Ananya Gupta", customerId: "c4", note: "Discuss career report", due: "2026-06-15", stage: "Scheduled", astrologer: "Guru Aditya Nath" },
  { id: "f5", customer: "Vivaan Singh", customerId: "c5", note: "Vastu visit recap", due: "2026-06-16", stage: "Scheduled", astrologer: "Guru Aditya Nath" },
  { id: "f6", customer: "Ishita Reddy", customerId: "c6", note: "Remedy feedback call", due: "2026-06-08", stage: "Missed", astrologer: "Pandit Vinay Tripathi" },
  { id: "f7", customer: "Arjun Nair", customerId: "c7", note: "Kundli matching follow-up", due: "2026-06-05", stage: "Done", astrologer: "Pandit Raghav Shastri" },
  { id: "f8", customer: "Sara Iyer", customerId: "c8", note: "Yantra installation help", due: "2026-06-18", stage: "Upcoming", astrologer: "Acharya Meera Joshi" },
  { id: "f9", customer: "Reyansh Mehta", customerId: "c9", note: "Renew annual reading", due: "2026-06-04", stage: "Done", astrologer: "Acharya Sneha Rao" },
];

export type TaskPriority = "High" | "Medium" | "Low";
export type TaskStatus = "To Do" | "In Progress" | "Done";

export interface PanditTask {
  id: string;
  title: string;
  detail: string;
  customer: string;
  priority: TaskPriority;
  status: TaskStatus;
  due: string;
}

export const panditTasks: PanditTask[] = [
  { id: "t1", title: "Prepare Kundli report", detail: "Complete birth chart analysis & PDF.", customer: "Aarav Sharma", priority: "High", status: "To Do", due: "2026-06-12" },
  { id: "t2", title: "Send marriage muhurat dates", detail: "Shortlist 3 auspicious dates.", customer: "Diya Verma", priority: "High", status: "To Do", due: "2026-06-13" },
  { id: "t3", title: "Gemstone sourcing call", detail: "Confirm certified Pukhraj availability.", customer: "Ananya Gupta", priority: "Medium", status: "In Progress", due: "2026-06-14" },
  { id: "t4", title: "Vastu site visit notes", detail: "Compile recommendations document.", customer: "Vivaan Singh", priority: "Medium", status: "In Progress", due: "2026-06-15" },
  { id: "t5", title: "Mahamrityunjaya Jaap booking", detail: "Schedule pandits & samagri.", customer: "Ishita Reddy", priority: "Low", status: "To Do", due: "2026-06-16" },
  { id: "t6", title: "Follow-up feedback call", detail: "Check remedy results after 30 days.", customer: "Kabir Patel", priority: "Medium", status: "Done", due: "2026-06-08" },
  { id: "t7", title: "Annual reading renewal", detail: "Prepare renewal proposal.", customer: "Reyansh Mehta", priority: "Low", status: "Done", due: "2026-06-05" },
  { id: "t8", title: "Numerology chart review", detail: "Cross-check name vibration numbers.", customer: "Arjun Nair", priority: "High", status: "In Progress", due: "2026-06-11" },
];

export const notifications: Notification[] = [
  { id: "n1", type: "consultation", title: "Upcoming consultation", body: "Aarav Sharma at 11:00 AM today on Career Growth.", time: "10 min ago", read: false },
  { id: "n2", type: "followup", title: "Missed follow-up", body: "Kabir Patel's pooja booking follow-up was missed.", time: "1 hour ago", read: false },
  { id: "n3", type: "customer", title: "New customer added", body: "Riya Sharma joined as a new lead.", time: "3 hours ago", read: false },
  { id: "n4", type: "reminder", title: "Reminder", body: "Send marriage muhurat dates to Diya Verma.", time: "5 hours ago", read: true },
  { id: "n5", type: "consultation", title: "Consultation completed", body: "Ishita Reddy's gemstone advice session is done.", time: "Yesterday", read: true },
  { id: "n6", type: "reminder", title: "Reminder", body: "Renew annual reading for Reyansh Mehta.", time: "Yesterday", read: true },
];

export const activityFeed: ActivityItem[] = [
  { id: "ac1", actor: "Acharya Meera Joshi", action: "recommended", target: "Yellow Sapphire to Aarav Sharma", time: "5m ago" },
  { id: "ac2", actor: "Pandit Raghav Shastri", action: "completed consultation with", target: "Ananya Gupta", time: "22m ago" },
  { id: "ac3", actor: "System", action: "added new lead", target: "Riya Sharma", time: "1h ago" },
  { id: "ac4", actor: "Acharya Sneha Rao", action: "scheduled follow-up for", target: "Diya Verma", time: "2h ago" },
  { id: "ac5", actor: "Guru Aditya Nath", action: "uploaded Vastu report for", target: "Vivaan Singh", time: "4h ago" },
];

export const revenueData = [
  { month: "Jan", revenue: 320000, consultations: 180 },
  { month: "Feb", revenue: 358000, consultations: 205 },
  { month: "Mar", revenue: 412000, consultations: 240 },
  { month: "Apr", revenue: 468000, consultations: 268 },
  { month: "May", revenue: 521000, consultations: 312 },
  { month: "Jun", revenue: 596000, consultations: 354 },
];

export const customerGrowth = [
  { month: "Jan", customers: 420 },
  { month: "Feb", customers: 512 },
  { month: "Mar", customers: 640 },
  { month: "Apr", customers: 788 },
  { month: "May", customers: 962 },
  { month: "Jun", customers: 1184 },
];

export const consultationTypes = [
  { name: "Vedic / Kundli", value: 38 },
  { name: "Gemstone", value: 24 },
  { name: "Vastu", value: 18 },
  { name: "Marriage", value: 12 },
  { name: "Tarot", value: 8 },
];

export const funnelStages = [
  { stage: "New Lead", count: 1240, color: "var(--chart-3)" },
  { stage: "Contacted", count: 892, color: "var(--chart-1)" },
  { stage: "Consultation Booked", count: 564, color: "var(--chart-4)" },
  { stage: "Consultation Completed", count: 398, color: "var(--chart-2)" },
  { stage: "Converted Customer", count: 286, color: "var(--chart-5)" },
];

export const topGemstones = [
  { name: "Yellow Sapphire", count: 142 },
  { name: "Blue Sapphire", count: 118 },
  { name: "Emerald", count: 96 },
  { name: "Red Coral", count: 74 },
  { name: "5 Mukhi Rudraksha", count: 63 },
];

export const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
