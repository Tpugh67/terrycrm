import type { LucideIcon } from "lucide-react";
import {
  Home, ShieldCheck, Landmark, Car, Sun, TrendingUp, Scale, Target,
  HeartPulse, HardHat, Lightbulb, ShoppingCart, Building2, Truck,
  Smile, Dumbbell, Heart, GraduationCap,
} from "lucide-react";

/**
 * Single source of truth for every industry landing page. Real content —
 * hero copy, feature descriptions, and demo pipeline data — extracted
 * verbatim from the original 18 hand-built pages (see
 * docs/adr/0002-industry-page-config.md for how and why), not rewritten
 * or invented. One dynamic route (src/app/(marketing)/[industry]/page.tsx)
 * renders all 18 from this file — no per-industry page files, no
 * duplicated layout code.
 */

export type DemoDeal = {
  title: string;
  subtitle: string;
  headlineValue: string;
  detail: string;
  stage: string;
  hot: boolean;
  followUp: string;
};

export type IndustryFeature = { title: string; description: string };

export type IndustryPageData = {
  slug: string;
  label: string;
  icon: LucideIcon;
  color: string;
  eyebrow: string;
  heroTitle: string;
  heroDescription: string;
  ctaHeadline: string;
  headlineLabel: string;
  stages: string[];
  demoDeals: DemoDeal[];
  features: IndustryFeature[];
};

export const INDUSTRY_PAGES = {
  "real-estate": {
    slug: "real-estate",
    label: "Real Estate",
    icon: Home,
    color: "#2563eb",
    eyebrow: "Real Estate Wholesalers & Investors",
    heroTitle: "Your wholesale pipeline, built the way you work",
    heroDescription: "Track ARV, calculate spread, log seller conversations, and never miss a follow-up. Built for real estate wholesalers \u2014 not generic salespeople.",
    ctaHeadline: "Ready to close more wholesale deals?",
    headlineLabel: "Spread",
    stages: ["New Lead", "Contacted", "Offer Made", "Under Contract", "Closed Won"],
    demoDeals: [
    { title: "123 Oak Street", subtitle: "Seller: John Smith", headlineValue: "$90,000", detail: "ARV: $285,000 \u00b7 Ask: $195,000", stage: "New Lead", hot: true, followUp: "Overdue" },
    { title: "456 Maple Ave", subtitle: "Seller: Sarah Johnson", headlineValue: "$110,000", detail: "ARV: $420,000 \u00b7 Ask: $310,000", stage: "Contacted", hot: true, followUp: "Today" },
    { title: "789 Pine Rd", subtitle: "Seller: Mike Davis", headlineValue: "$30,000", detail: "ARV: $185,000 \u00b7 Ask: $155,000", stage: "Offer Made", hot: false, followUp: "Tomorrow" },
    { title: "321 Elm Court", subtitle: "Seller: Lisa Wilson", headlineValue: "$170,000", detail: "ARV: $650,000 \u00b7 Ask: $480,000", stage: "Under Contract", hot: true, followUp: "Next week" },
    { title: "654 Cedar Blvd", subtitle: "Seller: Tom Brown", headlineValue: "$60,000", detail: "ARV: $310,000 \u00b7 Ask: $250,000", stage: "Closed Won", hot: false, followUp: "Done" }
    ],
    features: [
    { title: "ARV & Spread Calculator", description: "Enter ARV and asking price \u2014 spread calculates automatically. Hot deal alerts fire when spread hits $50K+." },
    { title: "Hot Deal Alerts", description: "High-spread deals get automatically flagged so you never miss a big opportunity in a crowded pipeline." },
    { title: "Seller Activity Log", description: "Log every call, text, voicemail, and offer with one click. Full conversation history on every deal." },
    { title: "Follow-up Reminders", description: "Set follow-up dates and get overdue alerts. The fortune is in the follow-up \u2014 never forget one again." },
    { title: "5-Stage Pipeline", description: "New Lead \u2192 Contacted \u2192 Offer Made \u2192 Under Contract \u2192 Closed Won. Stages built for wholesale deals." },
    { title: "Pipeline Dashboard", description: "See total spread in pipeline, hot deals, overdue follow-ups, and closed deals \u2014 all in one view." }
  ],
  },
  "insurance": {
    slug: "insurance",
    label: "Insurance",
    icon: ShieldCheck,
    color: "#059669",
    eyebrow: "Insurance Agents & Brokers",
    heroTitle: "Your client pipeline, built for insurance agents",
    heroDescription: "Track prospects, quotes, applications, and renewals. Log every call and follow-up. Built for insurance agents \u2014 not generic salespeople.",
    ctaHeadline: "Ready to close more policies?",
    headlineLabel: "Commission",
    stages: ["New Lead", "Quoted", "Application Sent", "Underwriting", "Policy Issued"],
    demoDeals: [
    { title: "Martinez Family \u2014 Auto Bundle", subtitle: "Client: Carlos Martinez", headlineValue: "$840", detail: "Premium: $4,200/yr", stage: "New Lead", hot: true, followUp: "Overdue" },
    { title: "Johnson Home & Life Package", subtitle: "Client: Rebecca Johnson", headlineValue: "$1,360", detail: "Premium: $6,800/yr", stage: "Quoted", hot: true, followUp: "Today" },
    { title: "Chen Business Liability", subtitle: "Client: David Chen", headlineValue: "$2,500", detail: "Premium: $12,500/yr", stage: "Application Sent", hot: false, followUp: "Tomorrow" },
    { title: "Williams Medicare Supplement", subtitle: "Client: Dorothy Williams", headlineValue: "$720", detail: "Premium: $3,600/yr", stage: "Underwriting", hot: true, followUp: "Next week" },
    { title: "Thompson Commercial Auto", subtitle: "Client: James Thompson", headlineValue: "$1,780", detail: "Premium: $8,900/yr", stage: "Policy Issued", hot: false, followUp: "Done" }
    ],
    features: [
    { title: "Multi-Line Policy Tracking", description: "Track auto, home, life, health, and commercial policies in one pipeline. Bundle opportunities surface automatically." },
    { title: "Renewal Pipeline", description: "Never lose a renewal. Set renewal dates and get alerts 60, 30, and 7 days before policies expire." },
    { title: "Client Activity Log", description: "Log every call, email, and meeting with one click. Full conversation history on every prospect." },
    { title: "Commission Calculator", description: "Enter premium and commission rate \u2014 your commission calculates automatically across your whole pipeline." },
    { title: "5-Stage Pipeline", description: "New Lead \u2192 Quoted \u2192 Application Sent \u2192 Underwriting \u2192 Policy Issued. Built for the insurance sales cycle." },
    { title: "Pipeline Dashboard", description: "See total pipeline commission, hot prospects, overdue follow-ups, and issued policies \u2014 all in one view." }
  ],
  },
  "mortgage": {
    slug: "mortgage",
    label: "Mortgage & Lending",
    icon: Landmark,
    color: "#7c3aed",
    eyebrow: "Mortgage Loan Officers & Brokers",
    heroTitle: "Your loan pipeline, built for mortgage pros",
    heroDescription: "Track borrowers from pre-qual to closing. Log every document, call, and condition. Built for loan officers \u2014 not generic salespeople.",
    ctaHeadline: "Ready to close more loans?",
    headlineLabel: "Commission",
    stages: ["New Lead", "Pre-Qualified", "Application", "Processing", "Closed"],
    demoDeals: [
    { title: "Anderson Purchase \u2014 FHA 3.5%", subtitle: "Borrower: Mark Anderson", headlineValue: "$3,200", detail: "Loan: $320,000", stage: "New Lead", hot: true, followUp: "Overdue" },
    { title: "Garcia Refinance \u2014 Conv 30yr", subtitle: "Borrower: Maria Garcia", headlineValue: "$4,850", detail: "Loan: $485,000", stage: "Pre-Qualified", hot: true, followUp: "Today" },
    { title: "Lee Investment Property", subtitle: "Borrower: Kevin Lee", headlineValue: "$6,500", detail: "Loan: $650,000", stage: "Application", hot: false, followUp: "Tomorrow" },
    { title: "Patel First-Time Buyer", subtitle: "Borrower: Priya Patel", headlineValue: "$2,900", detail: "Loan: $290,000", stage: "Processing", hot: true, followUp: "Next week" },
    { title: "Robinson Cash-Out Refi", subtitle: "Borrower: Angela Robinson", headlineValue: "$4,100", detail: "Loan: $410,000", stage: "Closed", hot: false, followUp: "Done" }
    ],
    features: [],
  },
  "auto": {
    slug: "auto",
    label: "Automotive",
    icon: Car,
    color: "#dc2626",
    eyebrow: "Automotive Dealers & Sales Reps",
    heroTitle: "Your auto sales pipeline, built for car pros",
    heroDescription: "Track every buyer from test drive to delivery. Log every call and follow-up. Built for auto sales \u2014 not generic salespeople.",
    ctaHeadline: "Ready to sell more vehicles?",
    headlineLabel: "Value",
    stages: ["New Lead", "Test Drive", "Negotiating", "Finance", "Delivered"],
    demoDeals: [
    { title: "Johnson 2024 F-150 XLT", subtitle: "Mike Johnson \u00b7 Listed: $48,500", headlineValue: "$2,400", detail: "", stage: "New Lead", hot: true, followUp: "Overdue" },
    { title: "Garcia Honda Accord Trade-In", subtitle: "Rosa Garcia \u00b7 Listed: $31,200", headlineValue: "$1,560", detail: "", stage: "Test Drive", hot: true, followUp: "Today" },
    { title: "Lee BMW X5 Fleet Order", subtitle: "Corporate Lee \u00b7 Listed: $62,800", headlineValue: "$3,140", detail: "", stage: "Negotiating", hot: false, followUp: "Tomorrow" },
    { title: "Williams Used Camry", subtitle: "Tom Williams \u00b7 Listed: $24,500", headlineValue: "$1,225", detail: "", stage: "Finance", hot: true, followUp: "Next week" },
    { title: "Brown Tesla Model 3", subtitle: "Sandra Brown \u00b7 Listed: $42,000", headlineValue: "$2,100", detail: "", stage: "Delivered", hot: false, followUp: "Done" }
    ],
    features: [],
  },
  "solar": {
    slug: "solar",
    label: "Solar Energy",
    icon: Sun,
    color: "#eab308",
    eyebrow: "Solar Sales Consultants",
    heroTitle: "Your solar pipeline, from lead to install",
    heroDescription: "Track system size, proposals, permits, and installs. Log every site visit and follow-up. Built for solar reps \u2014 not generic salespeople.",
    ctaHeadline: "Ready to install more systems?",
    headlineLabel: "Commission",
    stages: ["New Lead", "Site Survey", "Proposal Sent", "Permitting", "Installed"],
    demoDeals: [
    { title: "Henderson Residential 8kW", subtitle: "Client: Bob Henderson \u00b7 8 kW", headlineValue: "$2,400", detail: "", stage: "New Lead", hot: true, followUp: "Overdue" },
    { title: "Nguyen Commercial 45kW", subtitle: "Client: Tina Nguyen \u00b7 45 kW", headlineValue: "$9,000", detail: "", stage: "Site Survey", hot: true, followUp: "Today" },
    { title: "Park Residential 12kW", subtitle: "Client: James Park \u00b7 12 kW", headlineValue: "$3,600", detail: "", stage: "Proposal Sent", hot: false, followUp: "Tomorrow" },
    { title: "Miller Farm 120kW", subtitle: "Client: Dale Miller \u00b7 120 kW", headlineValue: "$18,000", detail: "", stage: "Permitting", hot: true, followUp: "Next week" },
    { title: "Torres Residential 6kW", subtitle: "Client: Carmen Torres \u00b7 6 kW", headlineValue: "$1,800", detail: "", stage: "Installed", hot: false, followUp: "Done" }
    ],
    features: [],
  },
  "financial": {
    slug: "financial",
    label: "Financial Services",
    icon: TrendingUp,
    color: "#1d4ed8",
    eyebrow: "Financial Advisors & Wealth Managers",
    heroTitle: "Your client pipeline, built for financial advisors",
    heroDescription: "Track prospects, discovery calls, proposals, and accounts under management. Built for financial professionals.",
    ctaHeadline: "Ready to grow your book of business?",
    headlineLabel: "Value",
    stages: ["Prospect", "Discovery Call", "Proposal Sent", "Compliance Review", "Client Onboarded"],
    demoDeals: [
    { title: "Henderson Retirement Plan", subtitle: "Bob Henderson \u00b7 AUM: $850,000", headlineValue: "Fee: $8,500/yr", detail: "", stage: "Prospect", hot: true, followUp: "Overdue" },
    { title: "Nguyen Portfolio Review", subtitle: "Tina Nguyen \u00b7 AUM: $1,200,000", headlineValue: "Fee: $12,000/yr", detail: "", stage: "Discovery Call", hot: true, followUp: "Today" },
    { title: "Park 401k Rollover", subtitle: "James Park \u00b7 AUM: $320,000", headlineValue: "Fee: $3,200/yr", detail: "", stage: "Proposal Sent", hot: false, followUp: "Tomorrow" },
    { title: "Miller Estate Planning", subtitle: "Dale Miller \u00b7 AUM: $2,400,000", headlineValue: "Fee: $24,000/yr", detail: "", stage: "Compliance Review", hot: true, followUp: "Next week" },
    { title: "Torres College Savings", subtitle: "Carmen Torres \u00b7 AUM: $180,000", headlineValue: "Fee: $1,800/yr", detail: "", stage: "Client Onboarded", hot: false, followUp: "Done" }
    ],
    features: [],
  },
  "legal": {
    slug: "legal",
    label: "Legal",
    icon: Scale,
    color: "#334155",
    eyebrow: "Law Firms & Attorneys",
    heroTitle: "Your client pipeline, built for legal professionals",
    heroDescription: "Track prospects, consultations, retainers, and cases. Log every call and meeting. Built for law firms \u2014 not generic salespeople.",
    ctaHeadline: "Ready to grow your practice?",
    headlineLabel: "Value",
    stages: ["Inquiry", "Consultation", "Retainer Signed", "Active Case", "Closed"],
    demoDeals: [
    { title: "Martinez Divorce Proceedings", subtitle: "Elena Martinez \u00b7 Retainer: $5,000", headlineValue: "Case Value: $5,000", detail: "", stage: "Inquiry", hot: true, followUp: "Overdue" },
    { title: "Johnson Business Formation", subtitle: "David Johnson \u00b7 Retainer: $2,500", headlineValue: "Case Value: $2,500", detail: "", stage: "Consultation", hot: true, followUp: "Today" },
    { title: "Chen Personal Injury", subtitle: "Amy Chen \u00b7 Contingency: 33%", headlineValue: "Est. Value: $45,000", detail: "", stage: "Retainer Signed", hot: false, followUp: "Tomorrow" },
    { title: "Williams Estate Planning", subtitle: "Robert Williams \u00b7 Flat Fee: $3,200", headlineValue: "Case Value: $3,200", detail: "", stage: "Active Case", hot: true, followUp: "Next week" },
    { title: "Thompson DUI Defense", subtitle: "Kyle Thompson \u00b7 Retainer: $7,500", headlineValue: "Case Value: $7,500", detail: "", stage: "Closed", hot: false, followUp: "Done" }
    ],
    features: [],
  },
  "recruiting": {
    slug: "recruiting",
    label: "Recruiting",
    icon: Target,
    color: "#4f46e5",
    eyebrow: "Staffing Agencies & Recruiters",
    heroTitle: "Your recruiting pipeline, built for talent pros",
    heroDescription: "Track candidates from sourcing to placement. Log every interview and offer. Built for recruiters \u2014 not generic salespeople.",
    ctaHeadline: "Ready to place more candidates?",
    headlineLabel: "Value",
    stages: ["Sourced", "Screening", "Interviewing", "Offer Stage", "Placed"],
    demoDeals: [
    { title: "Sarah K. \u2014 Senior Dev Role", subtitle: "TechCorp Client \u00b7 Salary: $140,000", headlineValue: "Fee: $21,000", detail: "", stage: "Sourced", hot: true, followUp: "Overdue" },
    { title: "Marcus T. \u2014 Sales Manager", subtitle: "RetailCo Client \u00b7 Salary: $95,000", headlineValue: "Fee: $14,250", detail: "", stage: "Screening", hot: true, followUp: "Today" },
    { title: "Priya N. \u2014 Data Analyst", subtitle: "FinanceCo Client \u00b7 Salary: $110,000", headlineValue: "Fee: $16,500", detail: "", stage: "Interviewing", hot: false, followUp: "Tomorrow" },
    { title: "James W. \u2014 Operations Dir", subtitle: "LogisticsCo Client \u00b7 Salary: $125,000", headlineValue: "Fee: $18,750", detail: "", stage: "Offer Stage", hot: true, followUp: "Next week" },
    { title: "Linda M. \u2014 Marketing VP", subtitle: "StartupCo Client \u00b7 Salary: $160,000", headlineValue: "Fee: $24,000", detail: "", stage: "Placed", hot: false, followUp: "Done" }
    ],
    features: [],
  },
  "healthcare": {
    slug: "healthcare",
    label: "Healthcare",
    icon: HeartPulse,
    color: "#0891b2",
    eyebrow: "Healthcare Practices & Clinics",
    heroTitle: "Your patient pipeline, built for healthcare pros",
    heroDescription: "Track referrals, consultations, and treatment plans. Log every appointment and follow-up. Built for healthcare practices \u2014 not generic CRMs.",
    ctaHeadline: "Ready to grow your practice?",
    headlineLabel: "Value",
    stages: ["Referral", "Consultation", "Treatment Plan", "In Treatment", "Completed"],
    demoDeals: [
    { title: "Johnson Annual Physical", subtitle: "Mary Johnson \u00b7 Procedure: Physical", headlineValue: "Value: $450", detail: "", stage: "Referral", hot: true, followUp: "Overdue" },
    { title: "Garcia Ortho Consultation", subtitle: "Carlos Garcia \u00b7 Procedure: Knee Eval", headlineValue: "Value: $800", detail: "", stage: "Consultation", hot: true, followUp: "Today" },
    { title: "Lee Dental Implant", subtitle: "Susan Lee \u00b7 Procedure: Implant", headlineValue: "Value: $4,200", detail: "", stage: "Treatment Plan", hot: false, followUp: "Tomorrow" },
    { title: "Williams Sleep Study", subtitle: "Bob Williams \u00b7 Procedure: Sleep Eval", headlineValue: "Value: $1,800", detail: "", stage: "In Treatment", hot: true, followUp: "Next week" },
    { title: "Chen Cardiac Workup", subtitle: "Helen Chen \u00b7 Procedure: Echo + Stress", headlineValue: "Value: $2,400", detail: "", stage: "Completed", hot: false, followUp: "Done" }
    ],
    features: [],
  },
  "construction": {
    slug: "construction",
    label: "Construction",
    icon: HardHat,
    color: "#ea580c",
    eyebrow: "Contractors & Construction Companies",
    heroTitle: "Your project pipeline, built for contractors",
    heroDescription: "Track bids, contracts, and project milestones. Log every site visit and client call. Built for contractors \u2014 not generic salespeople.",
    ctaHeadline: "Ready to win more contracts?",
    headlineLabel: "Value",
    stages: ["Bid Submitted", "Negotiating", "Contract Signed", "In Progress", "Completed"],
    demoDeals: [
    { title: "Henderson Kitchen Remodel", subtitle: "Bob Henderson \u00b7 Bid: $45,000", headlineValue: "Margin: $12,000", detail: "", stage: "Bid Submitted", hot: true, followUp: "Overdue" },
    { title: "Garcia Office Build-Out", subtitle: "Maria Garcia \u00b7 Bid: $180,000", headlineValue: "Margin: $45,000", detail: "", stage: "Negotiating", hot: true, followUp: "Today" },
    { title: "Lee Residential Addition", subtitle: "Kevin Lee \u00b7 Bid: $95,000", headlineValue: "Margin: $22,000", detail: "", stage: "Contract Signed", hot: false, followUp: "Tomorrow" },
    { title: "Williams Commercial Roofing", subtitle: "Dale Williams \u00b7 Bid: $68,000", headlineValue: "Margin: $18,000", detail: "", stage: "In Progress", hot: true, followUp: "Next week" },
    { title: "Thompson New Home Build", subtitle: "James Thompson \u00b7 Bid: $420,000", headlineValue: "Margin: $84,000", detail: "", stage: "Completed", hot: false, followUp: "Done" }
    ],
    features: [],
  },
  "consulting": {
    slug: "consulting",
    label: "Consulting",
    icon: Lightbulb,
    color: "#9333ea",
    eyebrow: "Consultants & Business Advisors",
    heroTitle: "Your client pipeline, built for consultants",
    heroDescription: "Track prospects, proposals, and engagements. Log every meeting and deliverable. Built for consultants \u2014 not generic salespeople.",
    ctaHeadline: "Ready to win more engagements?",
    headlineLabel: "Value",
    stages: ["Prospect", "Discovery Call", "Proposal Sent", "Negotiating", "Engaged"],
    demoDeals: [
    { title: "Harrison Strategy Engagement", subtitle: "CEO Mark Harrison \u00b7 Scope: 6 months", headlineValue: "Value: $48,000", detail: "", stage: "Prospect", hot: true, followUp: "Overdue" },
    { title: "Nguyen Digital Transformation", subtitle: "CTO Tina Nguyen \u00b7 Scope: 3 months", headlineValue: "Value: $28,500", detail: "", stage: "Discovery Call", hot: true, followUp: "Today" },
    { title: "Park Process Optimization", subtitle: "COO James Park \u00b7 Scope: 4 months", headlineValue: "Value: $36,000", detail: "", stage: "Proposal Sent", hot: false, followUp: "Tomorrow" },
    { title: "Miller Fractional CFO", subtitle: "Owner Dale Miller \u00b7 Scope: Ongoing", headlineValue: "Value: $4,500/mo", detail: "", stage: "Negotiating", hot: true, followUp: "Next week" },
    { title: "Torres Sales Training", subtitle: "VP Carmen Torres \u00b7 Scope: Workshop", headlineValue: "Value: $12,000", detail: "", stage: "Engaged", hot: false, followUp: "Done" }
    ],
    features: [],
  },
  "ecommerce": {
    slug: "ecommerce",
    label: "E-Commerce",
    icon: ShoppingCart,
    color: "#db2777",
    eyebrow: "E-Commerce Brands & Stores",
    heroTitle: "Your e-commerce pipeline, built for online sellers",
    heroDescription: "Track wholesale buyers, retail partners, and B2B accounts. Log every conversation and order. Built for e-commerce brands.",
    ctaHeadline: "Ready to grow your accounts?",
    headlineLabel: "Value",
    stages: ["Prospect", "Intro Call", "Samples Sent", "Negotiating", "Active Account"],
    demoDeals: [
    { title: "Walmart Marketplace Onboarding", subtitle: "Buyer Sarah K. \u00b7 Category: Apparel", headlineValue: "Est. Volume: $180,000", detail: "", stage: "Prospect", hot: true, followUp: "Overdue" },
    { title: "Amazon Brand Registry", subtitle: "Account Marcus T. \u00b7 Category: Electronics", headlineValue: "Est. Volume: $95,000", detail: "", stage: "Intro Call", hot: true, followUp: "Today" },
    { title: "Target.com Partnership", subtitle: "Buyer Priya N. \u00b7 Category: Home Goods", headlineValue: "Est. Volume: $240,000", detail: "", stage: "Samples Sent", hot: false, followUp: "Tomorrow" },
    { title: "Shopify B2B Portal", subtitle: "Wholesale James W. \u00b7 Category: Beauty", headlineValue: "Est. Volume: $62,000", detail: "", stage: "Negotiating", hot: true, followUp: "Next week" },
    { title: "TikTok Shop Integration", subtitle: "Creator Linda M. \u00b7 Category: Fashion", headlineValue: "Est. Volume: $45,000", detail: "", stage: "Active Account", hot: false, followUp: "Done" }
    ],
    features: [],
  },
  "property-management": {
    slug: "property-management",
    label: "Property Mgmt",
    icon: Building2,
    color: "#0d9488",
    eyebrow: "Property Managers & Landlords",
    heroTitle: "Your property pipeline, built for property managers",
    heroDescription: "Track vacancies, applications, leases, and renewals. Log every showing and tenant call. Built for property managers.",
    ctaHeadline: "Ready to fill your vacancies?",
    headlineLabel: "Value",
    stages: ["Vacancy Posted", "Showing Scheduled", "Application", "Background Check", "Lease Signed"],
    demoDeals: [
    { title: "Oakwood Apartments \u2014 2BR", subtitle: "Applicant John S. \u00b7 Rent: $1,850/mo", headlineValue: "Annual: $22,200", detail: "", stage: "Vacancy Posted", hot: true, followUp: "Overdue" },
    { title: "Maple Court \u2014 1BR Studio", subtitle: "Applicant Maria G. \u00b7 Rent: $1,200/mo", headlineValue: "Annual: $14,400", detail: "", stage: "Showing Scheduled", hot: true, followUp: "Today" },
    { title: "Pine Ridge \u2014 3BR House", subtitle: "Applicant Kevin L. \u00b7 Rent: $2,400/mo", headlineValue: "Annual: $28,800", detail: "", stage: "Application", hot: false, followUp: "Tomorrow" },
    { title: "Elm Street \u2014 Commercial", subtitle: "Tenant Priya P. \u00b7 Rent: $4,200/mo", headlineValue: "Annual: $50,400", detail: "", stage: "Background Check", hot: true, followUp: "Next week" },
    { title: "Cedar Commons \u2014 2BR", subtitle: "Tenant Angela R. \u00b7 Rent: $1,650/mo", headlineValue: "Annual: $19,800", detail: "", stage: "Lease Signed", hot: false, followUp: "Done" }
    ],
    features: [],
  },
  "trucking": {
    slug: "trucking",
    label: "Trucking & Logistics",
    icon: Truck,
    color: "#1e40af",
    eyebrow: "Trucking & Logistics Companies",
    heroTitle: "Your load pipeline, built for trucking pros",
    heroDescription: "Track loads, carriers, and freight contracts. Log every dispatch and delivery. Built for trucking companies \u2014 not generic CRMs.",
    ctaHeadline: "Ready to move more freight?",
    headlineLabel: "Value",
    stages: ["Load Posted", "Carrier Assigned", "In Transit", "Delivered", "Invoiced"],
    demoDeals: [
    { title: "Chicago to Dallas \u2014 Dry Van", subtitle: "Carrier Mike T. \u00b7 Miles: 920", headlineValue: "Rate: $3,680", detail: "", stage: "Load Posted", hot: true, followUp: "Overdue" },
    { title: "LA to Phoenix \u2014 Reefer", subtitle: "Carrier Rosa G. \u00b7 Miles: 370", headlineValue: "Rate: $2,220", detail: "", stage: "Carrier Assigned", hot: true, followUp: "Today" },
    { title: "Atlanta to Miami \u2014 Flatbed", subtitle: "Carrier Lee Corp \u00b7 Miles: 660", headlineValue: "Rate: $3,960", detail: "", stage: "In Transit", hot: false, followUp: "Tomorrow" },
    { title: "NYC to Boston \u2014 LTL", subtitle: "Carrier Tom W. \u00b7 Miles: 215", headlineValue: "Rate: $1,290", detail: "", stage: "Delivered", hot: true, followUp: "Next week" },
    { title: "Denver to Seattle \u2014 Hazmat", subtitle: "Carrier Sandra B. \u00b7 Miles: 1,320", headlineValue: "Rate: $7,920", detail: "", stage: "Invoiced", hot: false, followUp: "Done" }
    ],
    features: [],
  },
  "dental": {
    slug: "dental",
    label: "Dental",
    icon: Smile,
    color: "#0ea5e9",
    eyebrow: "Dental Practices",
    heroTitle: "Your patient pipeline, built for dental offices",
    heroDescription: "Track new patients, treatment plans, and follow-ups. Log every consultation and appointment. Built for dental practices.",
    ctaHeadline: "Ready to grow your practice?",
    headlineLabel: "Value",
    stages: ["New Patient", "Consultation", "Treatment Plan", "Scheduled", "Completed"],
    demoDeals: [
    { title: "Johnson Family \u2014 New Patient", subtitle: "Mary Johnson \u00b7 Treatment: Cleaning + X-Ray", headlineValue: "Value: $380", detail: "", stage: "New Patient", hot: true, followUp: "Overdue" },
    { title: "Garcia Invisalign Consult", subtitle: "Carlos Garcia \u00b7 Treatment: Invisalign", headlineValue: "Value: $5,800", detail: "", stage: "Consultation", hot: true, followUp: "Today" },
    { title: "Lee Implant Consultation", subtitle: "Susan Lee \u00b7 Treatment: Single Implant", headlineValue: "Value: $4,200", detail: "", stage: "Treatment Plan", hot: false, followUp: "Tomorrow" },
    { title: "Williams Whitening", subtitle: "Bob Williams \u00b7 Treatment: Zoom Whitening", headlineValue: "Value: $650", detail: "", stage: "Scheduled", hot: true, followUp: "Next week" },
    { title: "Chen Crown + Bridge", subtitle: "Helen Chen \u00b7 Treatment: Crown x2", headlineValue: "Value: $2,800", detail: "", stage: "Completed", hot: false, followUp: "Done" }
    ],
    features: [],
  },
  "fitness": {
    slug: "fitness",
    label: "Fitness & Wellness",
    icon: Dumbbell,
    color: "#16a34a",
    eyebrow: "Gyms, Trainers & Wellness Studios",
    heroTitle: "Your client pipeline, built for fitness pros",
    heroDescription: "Track prospects, trials, memberships, and renewals. Log every consultation and check-in. Built for fitness businesses.",
    ctaHeadline: "Ready to grow your membership?",
    headlineLabel: "Value",
    stages: ["Inquiry", "Free Trial", "Consultation", "Enrolled", "Active Member"],
    demoDeals: [
    { title: "Henderson \u2014 Personal Training", subtitle: "Bob Henderson \u00b7 Package: 12 sessions", headlineValue: "Value: $1,200", detail: "", stage: "Inquiry", hot: true, followUp: "Overdue" },
    { title: "Nguyen \u2014 Annual Membership", subtitle: "Tina Nguyen \u00b7 Package: Premium Annual", headlineValue: "Value: $1,440", detail: "", stage: "Free Trial", hot: true, followUp: "Today" },
    { title: "Park \u2014 Online Coaching", subtitle: "James Park \u00b7 Package: 3-month program", headlineValue: "Value: $897", detail: "", stage: "Consultation", hot: false, followUp: "Tomorrow" },
    { title: "Miller \u2014 Group Classes", subtitle: "Sarah Miller \u00b7 Package: Unlimited Month", headlineValue: "Value: $149/mo", detail: "", stage: "Enrolled", hot: true, followUp: "Next week" },
    { title: "Torres \u2014 Nutrition Coaching", subtitle: "Carmen Torres \u00b7 Package: 6-month plan", headlineValue: "Value: $1,800", detail: "", stage: "Active Member", hot: false, followUp: "Done" }
    ],
    features: [],
  },
  "nonprofit": {
    slug: "nonprofit",
    label: "Nonprofit",
    icon: Heart,
    color: "#e11d48",
    eyebrow: "Nonprofits & Fundraising Teams",
    heroTitle: "Your donor pipeline, built for nonprofits",
    heroDescription: "Track donors, grant applications, and fundraising campaigns. Log every touchpoint and gift. Built for nonprofits.",
    ctaHeadline: "Ready to grow your donor base?",
    headlineLabel: "Value",
    stages: ["Prospect", "Cultivation", "Ask Made", "Pledge Received", "Gift Closed"],
    demoDeals: [
    { title: "Johnson Family Foundation", subtitle: "Sarah Johnson \u00b7 Ask: Major Gift", headlineValue: "Potential: $50,000", detail: "", stage: "Prospect", hot: true, followUp: "Overdue" },
    { title: "Garcia Corporate Sponsor", subtitle: "Maria Garcia Corp \u00b7 Ask: Sponsorship", headlineValue: "Potential: $15,000", detail: "", stage: "Cultivation", hot: true, followUp: "Today" },
    { title: "Lee Annual Fund", subtitle: "Kevin Lee \u00b7 Ask: Annual Gift", headlineValue: "Potential: $2,500", detail: "", stage: "Ask Made", hot: false, followUp: "Tomorrow" },
    { title: "Williams Estate Gift", subtitle: "Dorothy Williams \u00b7 Ask: Planned Giving", headlineValue: "Potential: $125,000", detail: "", stage: "Pledge Received", hot: true, followUp: "Next week" },
    { title: "Thompson Event Sponsor", subtitle: "James Thompson \u00b7 Ask: Table Purchase", headlineValue: "Potential: $5,000", detail: "", stage: "Gift Closed", hot: false, followUp: "Done" }
    ],
    features: [],
  },
  "education": {
    slug: "education",
    label: "Education",
    icon: GraduationCap,
    color: "#6366f1",
    eyebrow: "Schools, Tutors & Ed-Tech Companies",
    heroTitle: "Your enrollment pipeline, built for educators",
    heroDescription: "Track prospects, tours, applications, and enrollments. Log every parent call and follow-up. Built for education businesses.",
    ctaHeadline: "Ready to grow your enrollment?",
    headlineLabel: "Value",
    stages: ["Inquiry", "Tour Scheduled", "Application", "Accepted", "Enrolled"],
    demoDeals: [
    { title: "Anderson Family \u2014 K-8 Enrollment", subtitle: "Parent Mark A. \u00b7 Program: Full Day", headlineValue: "Value: $18,000/yr", detail: "", stage: "Inquiry", hot: true, followUp: "Overdue" },
    { title: "Garcia Tutoring Package", subtitle: "Parent Maria G. \u00b7 Program: Math + Science", headlineValue: "Value: $3,600", detail: "", stage: "Tour Scheduled", hot: true, followUp: "Today" },
    { title: "Lee Online Coding Bootcamp", subtitle: "Student Kevin L. \u00b7 Program: 12-week", headlineValue: "Value: $4,800", detail: "", stage: "Application", hot: false, followUp: "Tomorrow" },
    { title: "Patel Private School App", subtitle: "Parent Priya P. \u00b7 Program: High School", headlineValue: "Value: $24,000/yr", detail: "", stage: "Accepted", hot: true, followUp: "Next week" },
    { title: "Robinson ESL Program", subtitle: "Student Angela R. \u00b7 Program: Evening Classes", headlineValue: "Value: $1,800", detail: "", stage: "Enrolled", hot: false, followUp: "Done" }
    ],
    features: [],
  },
};


export const INDUSTRY_SLUGS = Object.keys(INDUSTRY_PAGES);

export function getIndustryPage(slug: string): IndustryPageData | undefined {
  return INDUSTRY_PAGES[slug as keyof typeof INDUSTRY_PAGES];
}
