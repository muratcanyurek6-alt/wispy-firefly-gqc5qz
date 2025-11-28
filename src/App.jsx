import React, { useState, useEffect, useRef } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateProfile,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  setDoc,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
  where,
  limit, // EKLENDI
  startAfter, // EKLENDI
  serverTimestamp, // EKLENDI
} from "firebase/firestore";
import {
  MapPin,
  Users,
  Camera,
  PlusSquare,
  Search,
  CheckCircle,
  Star,
  Zap,
  X,
  Building2,
  Edit2,
  Trash2,
  Loader2,
  Mail,
  Lock,
  ArrowRight,
  MessageCircle,
  ShieldCheck,
  Upload,
  Sparkles,
  Link as LinkIcon,
  Instagram,
  Twitter,
  Crown,
  Send,
  AlertCircle,
  TrendingUp,
  Flame,
  Database,
  LogOut,
  Sun,
  Moon,
  Home,
  Wand2,
  User,
} from "lucide-react";

// --- TASARIM KURTARICI (CDN) ---
const TailwindCDN = () => (
  <link
    href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
    rel="stylesheet"
  />
);

/* --- CLOUDINARY AYARLARI --- */
const CLOUDINARY_CONFIG = {
  cloudName: "dqoh1mijk",
  uploadPreset: "yxdnini8",
};

/* --- FIREBASE AYARLARI --- */
const firebaseConfig = {
  apiKey: "AIzaSyAQmTeBxY21B0y51uJVfGCirJIi4xuSeWE",
  authDomain: "linkup-app-6318c.firebaseapp.com",
  projectId: "linkup-app-6318c",
  storageBucket: "linkup-app-6318c.firebasestorage.app",
  messagingSenderId: "189601473644",
  appId: "1:189601473644:web:b9e7f2339faf83e7ede449",
  measurementId: "G-QNG54EJ9R5",
};

const apiKey = "";

/* --- SİSTEM BAŞLATILIYOR --- */
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* --- KATEGORİLER --- */
const CATEGORIES = [
  { id: "COLLAB", label: "Collab 🎥", color: "purple" },
  { id: "S4S", label: "S4S / Promo 🔄", color: "pink" },
  { id: "AGENCY", label: "Agency 🏢", color: "indigo" },
  { id: "TRAVEL", label: "Travel ✈️", color: "blue" },
  { id: "HOUSING", label: "Housing 🏠", color: "emerald" },
  { id: "SERVICE", label: "Services 📸", color: "orange" },
];

/* --- RESİM YÜKLEME FONKSİYONU --- */
const uploadImageToCloudinary = async (file) => {
  if (!file) return null;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_CONFIG.uploadPreset);

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
      { method: "POST", body: formData }
    );
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    return data.secure_url;
  } catch (error) {
    console.error("Resim yükleme hatası:", error);
    return null;
  }
};

/* --- SAHTE VERİ OLUŞTURUCU --- */
const generateFakeData = async () => {
  const NAMES = [
    "Jessica",
    "Amber",
    "Roxy",
    "Luna",
    "Vixen",
    "Cherry",
    "Diamond",
    "Jade",
    "Scarlett",
    "Raven",
    "Kiki",
    "Bella",
    "Paris",
    "London",
    "Angel",
    "Sasha",
    "Mimi",
    "Coco",
    "Gigi",
    "Lola",
    "Zara",
    "Lexi",
    "Nikki",
    "Trixie",
    "Ava",
    "Maya",
    "Nina",
    "Ella",
    "Mila",
    "Hailey",
    "Kendall",
    "Riley",
    "Skylar",
    "Aria",
    "Savannah",
    "Brielle",
    "Nova",
    "Willow",
    "Blair",
    "Kimora",
    "Talia",
    "Journee",
    "Aaliyah",
    "Sierra",
    "Serena",
    "Melody",
    "Harlow",
    "Gianna",
    "Keira",
    "Ariana",
    "Ember",
    "Demi",
    "Fallon",
    "Alina",
    "Rhea",
    "Kara",
    "Vanessa",
    "Elise",
    "Cassie",
    "Monroe",
    "Avery",
    "Harper",
    "Brooklyn",
    "Piper",
    "Kylie",
    "Sienna",
    "Marley",
    "Jordyn",
    "Teagan",
    "Camila",
    "Selena",
  ];
  const SURNAME_EXT = [
    "xo",
    "Official",
    "Vip",
    "Babe",
    "Exclusive",
    "Model",
    "Fit",
    "Hot",
    "X",
    "Queen",
    "TheReal",
    "OG",
    "HQ",
    "Live",
    "Studio",
    "Creator",
    "Hub",
    "Club",
    "Angel",
    "Doll",
    "Prime",
    "Original",
    "TV",
    "Page",
    "Glow",
    "Star",
    "Vibes",
    "Dreams",
    "HD",
    "Plus",
    "Only",
    "XX",
    "Premium",
    "Elite",
    "Central",
    "Media",
    "Works",
    "World",
    "Cosmic",
    "Digital",
    "Hearts",
    "Cloud",
    "Galaxy",
    "Charm",
    "Mode",
  ];
  const LOCATIONS = [
    "Los Angeles, CA",
    "San Diego, CA",
    "San Francisco, CA",
    "San Jose, CA",
    "Sacramento, CA",
    "Long Beach, CA",
    "Oakland, CA",
    "Fresno, CA",
    "Miami, FL",
    "Orlando, FL",
    "Tampa, FL",
    "Jacksonville, FL",
    "Fort Lauderdale, FL",
    "New York, NY",
    "Brooklyn, NY",
    "Queens, NY",
    "Buffalo, NY",
    "Rochester, NY",
    "Las Vegas, NV",
    "Reno, NV",
    "Chicago, IL",
    "Aurora, IL",
    "Naperville, IL",
    "Houston, TX",
    "Dallas, TX",
    "Austin, TX",
    "San Antonio, TX",
    "Fort Worth, TX",
    "Phoenix, AZ",
    "Tucson, AZ",
    "Mesa, AZ",
    "Seattle, WA",
    "Spokane, WA",
    "Tacoma, WA",
    "Denver, CO",
    "Colorado Springs, CO",
    "Atlanta, GA",
    "Savannah, GA",
    "Charlotte, NC",
    "Raleigh, NC",
    "Durham, NC",
    "Philadelphia, PA",
    "Pittsburgh, PA",
    "Detroit, MI",
    "Grand Rapids, MI",
    "Portland, OR",
    "Eugene, OR",
    "Minneapolis, MN",
    "Saint Paul, MN",
    "Nashville, TN",
    "Memphis, TN",
    "New Orleans, LA",
    "Baton Rouge, LA",
    "Kansas City, MO",
    "St. Louis, MO",
    "Louisville, KY",
    "Baltimore, MD",
    "Milwaukee, WI",
    "Oklahoma City, OK",
    "Tulsa, OK",
    "Salt Lake City, UT",
    "Provo, UT",
    "Boise, ID",
    "Albuquerque, NM",
    "Honolulu, HI",
    "Anchorage, AK",
    "Online",
    "Remote",
    "Traveling",
    "London, UK",
    "Manchester, UK",
    "Birmingham, UK",
    "Paris, France",
    "Marseille, France",
    "Lyon, France",
    "Berlin, Germany",
    "Hamburg, Germany",
    "Munich, Germany",
    "Amsterdam, Netherlands",
    "Rotterdam, Netherlands",
    "The Hague, Netherlands",
    "Madrid, Spain",
    "Barcelona, Spain",
    "Valencia, Spain",
    "Rome, Italy",
    "Milan, Italy",
    "Florence, Italy",
    "Athens, Greece",
    "Mykonos, Greece",
    "Thessaloniki, Greece",
    "Lisbon, Portugal",
    "Porto, Portugal",
    "Faro, Portugal",
    "Warsaw, Poland",
    "Krakow, Poland",
    "Wroclaw, Poland",
    "Vienna, Austria",
    "Graz, Austria",
    "Linz, Austria",
    "Zurich, Switzerland",
    "Geneva, Switzerland",
    "Basel, Switzerland",
    "Prague, Czech Republic",
    "Brno, Czech Republic",
    "Ostrava, Czech Republic",
    "Budapest, Hungary",
    "Debrecen, Hungary",
    "Szeged, Hungary",
    "Istanbul, Turkey",
    "Mexico City, Mexico",
    "Tulum, Mexico",
    "Cancun, Mexico",
    "Buenos Aires, Argentina",
    "Rio de Janeiro, Brazil",
    "São Paulo, Brazil",
  ];
  const AVATARS = [
    "https://t1.pixhost.to/thumbs/10479/665424991_d1-2.jpg",
    "https://t1.pixhost.to/thumbs/10479/665424992_d1-3.jpg",
    "https://t1.pixhost.to/thumbs/10479/665424993_d1-4.jpg",
    "https://t1.pixhost.to/thumbs/10479/665424994_d1-5.jpg",
    "https://t1.pixhost.to/thumbs/10479/665424995_e1-1.jpg",
    "https://t1.pixhost.to/thumbs/10479/665424996_e1-2.jpg",
    "https://t1.pixhost.to/thumbs/10479/665424997_e1-3.jpg",
    "https://t1.pixhost.to/thumbs/10479/665424998_e1-4.jpg",
    "https://t1.pixhost.to/thumbs/10479/665424999_e1-5.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425000_f1-1.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425002_f1-2.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425004_f1-3.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425007_f1-4.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425008_f1-5.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425009_g1-1.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425011_g1-2.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425013_g1-3.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425014_g1-4.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425015_g1-5.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425016_h1-1.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425017_h1-2.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425018_h1-3.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425019_h1-4.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425020_h1-5.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425022_i1-1.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425023_i1-2.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425024_i1-3.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425025_i1-4.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425027_i1-5.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425028_j1-1.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425029_j1-2.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425030_j1-3.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425032_j1-4.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425033_j1-5.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425034_k1-1.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425035_k1-2.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425036_k1-3.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425037_k1-4.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425038_k1-5.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425040_l1-1.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425041_l1-2.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425042_l1-3.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425043_l1-4.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425046_l1-5.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425047_m1-1.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425048_m1-2.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425049_m1-3.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425050_m1-4.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425052_m1-5.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425053_n1-1.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425055_n1-2.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425057_n1-3.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425058_n1-4.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425059_n1-5.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425061_o1-1.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425062_o1-2.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425063_o1-3.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425064_o1-4.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425065_o1-5.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425066_p1-1.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425067_p1-2.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425068_p1-3.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425069_p1-4.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425070_p1-5.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425071_q1-1.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425072_q1-2.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425073_q1-3.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425076_q1-4.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425077_q1-5.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425078_r1-1.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425079_r1-2.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425080_r1-3.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425081_r1-4.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425082_r1-5.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425084_s1-1.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425086_s1-2.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425088_s1-3.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425089_s1-4.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425090_s1-5.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425092_t1-1.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425093_t1-2.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425095_t1-3.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425097_t1-4.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425099_t1-5.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425100_u1-1.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425103_u1-2.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425104_u1-3.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425107_u1-4.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425108_u1-5.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425109_v1-1.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425111_v1-2.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425112_v1-3.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425115_v1-4.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425116_v1-5.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425118_w1-1.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425120_w1-2.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425122_w1-3.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425124_w1-4.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425126_w1-5.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425129_x1-1.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425130_x1-2.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425132_x1-3.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425133_x1-4.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425135_x1-5.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425137_y1-1.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425140_y1-2.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425142_y1-3.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425145_y1-4.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425149_y1-5.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425152_z1-1.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425155_z1-2.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425157_z1-3.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425158_z1-4.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425159_z1-5.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425160_12-1.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425162_13-2.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425163_14-3.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425164_15-4.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425165_16-5.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425168_18-1.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425169_19-2.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425170_20-3.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425173_21-4.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425175_22-5.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425177_24-1.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425179_25-2.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425180_26-2.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425181_26-3.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425182_27-3.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425184_27-4.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425185_28-4.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425186_28-5.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425189_29-5.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425190_30-1.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425191_31-1.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425192_31-2.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425195_32-2.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425197_32-3.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425198_33-3.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425200_33-4.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425202_34-4.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425203_34-5.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425206_35-5.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425207_36-1.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425209_37-1.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425211_37-2.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425212_38-2.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425213_38-3.jpg",
    "https://t1.pixhost.to/thumbs/10479/665425216_39-3.jpg",
  ];

  const TEMPLATES = [
    {
      type: "COLLAB",
      text: "In LA this week! Looking for a shy/soft creator for cozy bedroom shoot vibes. NO explicit scenes shown. DM your OF or TikTok. 🌙📸",
    },
    {
      type: "COLLAB",
      text: "Anyone down for a cute couple-style photoshoot in SF? Coffee shop + matching outfits. You DON'T need a partner, we fake it lol. ☕💑📷",
    },
    {
      type: "COLLAB",
      text: "Looking for someone with natural look (no heavy makeup) to shoot shower content. Simple, steamy, clean aesthetic. NYC this weekend. 🚿✨",
    },
    {
      type: "COLLAB",
      text: "Prefer tattooed creators for alt-style hotel shoot. I’m in Berlin 3 days. Think grunge, neon, smoking aesthetic. 🔥🌆",
    },
    {
      type: "COLLAB",
      text: "Need a chatty girl for playful roleplay clips. Nothing crazy, more comedic. London! DM your vibe pls 😂💬🎭",
    },
    {
      type: "COLLAB",
      text: "ISO curvy creator for lingerie try-on haul. We both model & rate outfits. Miami. DM sizes + vibe. 💃📦",
    },
    {
      type: "COLLAB",
      text: "SFW Yoga collab for Reels/TikToks + BTS OF. Must be flexible or fake it well lol. Austin tomorrow. 🧘‍♀️📲",
    },
    {
      type: "COLLAB",
      text: "Couple creator looking for another girl to join soft G/G (no toys). Vancouver. We provide location + lighting. 💖",
    },
    {
      type: "COLLAB",
      text: "Looking to do POV ‘morning with gf’ style shoot (pancakes, kisses, blanket shots). Paris Airbnb. 🍳🛏️❤️",
    },
    {
      type: "COLLAB",
      text: "Creators in Toronto? Shooting locker room/bathroom aesthetic content. Funny + spicy. DM. 🛁🤳",
    },

    {
      type: "S4S",
      text: "S4S Twitter only. I have 110k promo page. Story + pinned. Must show analytics. Serious only. ⚡📈",
    },
    {
      type: "S4S",
      text: "L4L & C4C for TikTok creators posting spicy transitions. Must be 18+. DM link. 👀🎬",
    },
    {
      type: "S4S",
      text: "S4S today only. My Reddit page is 22k followers. I post daily at peak times. Need similar. 🦊📩",
    },
    {
      type: "S4S",
      text: "Getting shadowbanned sucks lol. Looking for small creator swaps (1–15k subs). No ego, just growth 💚📈",
    },
    {
      type: "S4S",
      text: "Need ONLY real creators, no AI faces. I check with FaceCheck. Swap? 😭🤚",
    },
    {
      type: "S4S",
      text: "Twitter/TT shoutouts available. If you’re active daily, DM your top clip. 🌀🔥",
    },
    {
      type: "S4S",
      text: "Shoutout train 8pm EST! Need 10 creators max. We all RT each other’s promo. Let’s blow up. 🌪️🔁",
    },
    {
      type: "S4S",
      text: "S4S on my niche page (alt goth/emo). If you fit that vibe DM. 🖤🩸",
    },
    {
      type: "S4S",
      text: "Looking 4 spicy cosplay creators for mutual promo thread today. DM your best outfit. 🧝‍♀️⚔️✨",
    },
    {
      type: "S4S",
      text: "Offering story shoutouts on my ‘fitness baddie’ page. You must post gym content. 💪🍑",
    },

    {
      type: "TRAVEL",
      text: "Going to Tulum in July. Need 2–3 girls to rent villa + daily beach shoots. Chill energy only. 🇲🇽🌴",
    },
    {
      type: "TRAVEL",
      text: "Dubai for New Year! We’re booking yacht content day. You pay flight, we pay hotel + crew. DM. 🛥️✨",
    },
    {
      type: "TRAVEL",
      text: "Munich → Prague road trip filming creator vlog + spicy BTS. Need someone who can drive manual lol. 🚗🎥🇨🇿",
    },
    {
      type: "TRAVEL",
      text: "Going to Tokyo for maid cafe + anime collabs. Must love kawaii aesthetic. DM interest. 🇯🇵🍥💖",
    },
    {
      type: "TRAVEL",
      text: "Island trip in Greece (Santorini). Shared villa. We film sunrise dresses + pool shots. No explicit needed. 🇬🇷🌅",
    },
    {
      type: "TRAVEL",
      text: "LA → Vegas weekend. We’re splitting gas + food. Shoot casino outfit content + hotel BTS. 🎰💋",
    },
    {
      type: "TRAVEL",
      text: "Looking for 1 creator to join us in Istanbul for bath house aesthetic shoot. Must be okay with towel shots. 🇹🇷🛁🕌",
    },
    {
      type: "TRAVEL",
      text: "Miami yacht club got us discount. We need 3 girls comfortable in bikinis + lifestyle clips. 🌴⚓",
    },
    {
      type: "TRAVEL",
      text: "Airbnb cabin trip in Colorado. Fireplace + couples content (sweet, playful). Snowy vibes. ❄️🔥",
    },
    {
      type: "TRAVEL",
      text: "Bali trip in Nov. We share chef + videographer. We film sunrise yoga + pool. Must respect schedules. 🇮🇩📸",
    },

    {
      type: "SERVICE",
      text: "Chatter available. I close high-ticket customs, upsells & weird requests lol. Commission only. 💬💵",
    },
    {
      type: "SERVICE",
      text: "Video editor for OF creators. I do moans syncing + transitions + subtitles. Quick turnaround. 🎬👄",
    },
    {
      type: "SERVICE",
      text: "Twitter strategist. I ghostwrite horny tweets that SELL. DM for samples. 😈✍️",
    },
    {
      type: "SERVICE",
      text: "Looking for a photographer who understands ‘softcore but cute’ vibe. Paid gig. LA. 📸🍼",
    },
    {
      type: "SERVICE",
      text: "Need a lawyer experienced with OF contracts + agency exits. DM me (serious). ⚖️📩",
    },
    {
      type: "SERVICE",
      text: "If you’re struggling to convert traffic → subs, I make landing pages + funnels. Proof available. 🧲📈",
    },
    {
      type: "SERVICE",
      text: "Reddit posting service. I know which subs take what, and how strict mods are. I get approvals. 🔺👀",
    },
    {
      type: "SERVICE",
      text: "Cosplay costume maker. I custom build outfits for creators, from maid to demon girl. DM. 🧵😈",
    },
    {
      type: "SERVICE",
      text: "Need help pricing? I make menus, bundles, upsells that actually sell. $30 flat. 💰🍒",
    },
    {
      type: "SERVICE",
      text: "German/English bilingual chatter. I turn shy subs into spenders. DM rates. 🇩🇪💶💬",
    },

    {
      type: "HOUSING",
      text: "Room in our LA content house (Studio City). You must be creator. Filming schedule organized. $1800/mo. 🏠🎥",
    },
    {
      type: "HOUSING",
      text: "Short stay (2–4 weeks) in our London flat. We shoot in living room. Must be okay with people filming. 📹🏡",
    },
    {
      type: "HOUSING",
      text: "Shared room in Miami mansion content house. You get access to studio + pool + cameras. Women only. 💦📸",
    },
    {
      type: "HOUSING",
      text: "Tiny room in NYC but crazy skyline rooftop access. Perfect for balcony shoots. $1400/mo. 🌇📷",
    },
    {
      type: "HOUSING",
      text: "Paris sublet (June). Cute balcony for lingerie shoots. DM for pics. 🇫🇷💋",
    },
    {
      type: "HOUSING",
      text: "Content friendly apartment in Barcelona. Rent + gear share. Filming allowed everywhere. 🇪🇸📸",
    },
    {
      type: "HOUSING",
      text: "Need roommate in Toronto. Must be comfortable with occasional filming in common areas. 🍁📹",
    },
    {
      type: "HOUSING",
      text: "Room open in Vegas house for creators going to AVN week. Short-term. 🎰🏡",
    },
    {
      type: "HOUSING",
      text: "Berlin loft share. We shoot grunge vibes against graffiti walls. $700/mo. 🇩🇪🖤",
    },
    {
      type: "HOUSING",
      text: "Looking for 1 girl to share Airbnb during photoshoot week in Chicago. Pool + steam room. DM interest. 🏊‍♀️📸",
    },

    {
      type: "AGENCY",
      text: "Small agency taking max 6 girls. We do TikTok + Reddit + managed chatters. Rev share starts 25%. 🚀📩",
    },
    {
      type: "AGENCY",
      text: "UK-based agency hiring EU creators. We provide videographers + editors + scripts. DM if active. 🇪🇺🎥",
    },
    {
      type: "AGENCY",
      text: "You make good content but flop on sales? We fix conversion, not just views. 0 upfront. 💸🔧",
    },
    {
      type: "AGENCY",
      text: "Spanish-speaking agency hiring new girls for LATAM market. We handle promotions + prices. 🇲🇽🇨🇴💬",
    },
    {
      type: "AGENCY",
      text: "Boutique management for alt/goth creators only. Must fit aesthetic. No exceptions. 🖤🩸",
    },
    {
      type: "AGENCY",
      text: "Looking for creators with 5–200 subs to scale from scratch. We grow small pages too. 📈🌱",
    },
    {
      type: "AGENCY",
      text: "Agency offering content planning + weekly scripts + customs strategies. No bots, no fake growth. 📅🧠",
    },
    {
      type: "AGENCY",
      text: "We take over DMs, pricing, funnels & promo. You just create content. DM if overwhelmed. 💼💋",
    },
    {
      type: "AGENCY",
      text: "LATAM/US agency expanding. Must be over 18 and post consistently. We provide editing + posting. 🌎🎬",
    },
    {
      type: "AGENCY",
      text: "We help creators exit bad agencies. Free audit + contract review. DM privately. 🔓📑",
    },

    // EXTRA MIX (GEN Z VIBE + MEMES + NATURAL)
    {
      type: "COLLAB",
      text: "Any girl down to film couple content where we pretend to be toxic but cute? 😂💔💖 NYC",
    },
    {
      type: "COLLAB",
      text: "Soft girl x gamer girl collab? Think headset, LED room, thigh highs. DM. 🎮💓",
    },
    {
      type: "S4S",
      text: "RT me I RT u. Must be spicy enough to make men stare but classy enough for Twitter mods 😭🔥",
    },
    {
      type: "SERVICE",
      text: "I ghostwrite flirty replies that make guys think you love them lol. Upsells go brrr 💸💌",
    },
    {
      type: "TRAVEL",
      text: "Thinking Ibiza for rave + shower content after club. Messy hair aesthetic. 🌈🛁",
    },
    {
      type: "HOUSING",
      text: "Looking for clean girl to live with. If you don’t clean we fight. House is content friendly tho 😭🏠📸",
    },
    {
      type: "AGENCY",
      text: "We don’t spam subs. We build parasocial addiction ethically (kinda). DM 💘🧠",
    },
    {
      type: "COLLAB",
      text: "Need someone who looks innocent but isn’t. That vibe sells. LA pls 👼😈",
    },
    {
      type: "SERVICE",
      text: "Spotify editor for moan beats + sexy TikTok remixes. DM your voice 😂🎧",
    },
    {
      type: "S4S",
      text: "S4S but only if your fans don’t ask ‘free?’ every 3 mins 😭🧍‍♂️",
    },
  ];

  let count = 0;
  // 10 ADET İLAN EKLEME DÖNGÜSÜ
  for (let i = 0; i < 10; i++) {
    const randomName =
      NAMES[Math.floor(Math.random() * NAMES.length)] +
      " " +
      SURNAME_EXT[Math.floor(Math.random() * SURNAME_EXT.length)];
    // Lokasyonları yeni listeden seç (GÜNCELLENDİ)
    const randomLoc = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
    const randomTemplate =
      TEMPLATES[Math.floor(Math.random() * TEMPLATES.length)];
    const randomAvatar = AVATARS[Math.floor(Math.random() * AVATARS.length)];
    const isBoosted = Math.random() > 0.85;
    const isUrgent = Math.random() > 0.9;
    const isVerified = Math.random() > 0.6;

    // Rastgele Tarih (Son 7 gün içinde)
    const randomTime =
      Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000);

    const fakePost = {
      ownerId: "fake_" + Math.random().toString(36).substr(2, 9),
      name: randomName,
      handle:
        "@" +
        randomName.replace(/\s/g, "").toLowerCase() +
        Math.floor(Math.random() * 99),
      image: randomAvatar,
      verified: isVerified,
      boosted: isBoosted,
      urgent: isUrgent,
      type: randomTemplate.type,
      location: randomLoc,
      desc: randomTemplate.text,
      tags: [randomTemplate.type, "New", "Viral", "Verified"],
      createdAt: randomTime,
      followers: Math.floor(Math.random() * 500) / 10 + "K",
      socials: {
        instagram: randomName.replace(/\s/g, "").toLowerCase(),
        twitter: randomName.replace(/\s/g, "").toLowerCase() + "_off",
      },
    };

    try {
      await addDoc(collection(db, "posts"), fakePost);
      count++;
    } catch (error) {
      console.error("Hata:", error);
    }
  }
  alert(`✅ ${count} yeni ve çeşitli ilan eklendi! Sayfayı yenile.`);
};

// --- SPOTLIGHT BİLEŞENİ ---
const Spotlight = ({ posts, onProfileClick }) => {
  const scrollRef = React.useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;
    let scrollAmount = 0;
    const scrollStep = 1;
    const scrollInterval = setInterval(() => {
      if (scrollContainer && !isPaused) {
        scrollContainer.scrollLeft += scrollStep;
        scrollAmount += scrollStep;
        if (
          scrollContainer.scrollLeft >=
          scrollContainer.scrollWidth - scrollContainer.clientWidth
        ) {
          scrollContainer.scrollLeft = 0;
        }
      }
    }, 30);
    return () => clearInterval(scrollInterval);
  }, [isPaused]);

  if (posts.length === 0) return null;

  return (
    <div className="mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex items-center gap-2 mb-3 px-4">
        <TrendingUp className="h-4 w-4 text-yellow-500" />
        <h3 className="text-xs font-bold text-gray-900 dark:text-gray-300 uppercase tracking-wider">
          Spotlight
        </h3>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-4 px-4 no-scrollbar scroll-smooth"
        style={{ whiteSpace: "nowrap" }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {posts.map((post) => (
          <div
            key={post.id}
            onClick={() => onProfileClick(post)}
            className="min-w-[260px] inline-block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded-xl cursor-pointer relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            <div className="absolute top-0 right-0 bg-yellow-500 text-black text-[9px] font-bold px-2 py-0.5 rounded-bl-lg z-10 flex items-center gap-1">
              <Star className="h-2 w-2 fill-black" /> FEATURED
            </div>
            <div className="flex items-center gap-3 mb-2 relative z-10">
              <img
                src={post.image}
                className="h-10 w-10 rounded-full object-cover border-2 border-yellow-500 shadow-md"
              />
              <div className="truncate">
                <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate w-32">
                  {post.name}
                </h4>
                <div className="text-[10px] text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <MapPin className="h-2 w-2 text-yellow-500" /> {post.location}
                </div>
              </div>
            </div>
            <p className="text-[11px] text-gray-600 dark:text-gray-300 line-clamp-2 whitespace-normal relative z-10">
              {post.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- CHAT MODAL (GERÇEK ZAMANLI) ---
const ChatModal = ({ activeChat, setActiveChat, user }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  // Chat ID creation: sort UIDs to ensure uniqueness regardless of who initiated
  const chatId = [user.uid, activeChat.ownerId].sort().join("_");

  useEffect(() => {
    if (!chatId) return;
    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("createdAt", "asc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [chatId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    await addDoc(collection(db, "chats", chatId, "messages"), {
      text: newMessage,
      senderId: user.uid,
      createdAt: serverTimestamp(),
    });
    setNewMessage("");
  };

  return (
    <div className="fixed bottom-0 right-0 md:right-4 w-full md:w-80 h-[400px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 md:rounded-t-2xl z-[100] flex flex-col shadow-2xl">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between bg-gray-50 dark:bg-gray-950 rounded-t-2xl">
        <span className="text-gray-900 dark:text-white font-bold">
          {activeChat.name}
        </span>
        <button
          onClick={() => setActiveChat(null)}
          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <X />
        </button>
      </div>
      <div className="flex-1 bg-gray-50 dark:bg-gray-900/90 p-4 overflow-y-auto flex flex-col gap-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-2 rounded-lg text-sm max-w-[80%] ${
              msg.senderId === user.uid
                ? "self-end bg-pink-600 text-white"
                : "self-start bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-200"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <form
        onSubmit={handleSendMessage}
        className="p-3 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex gap-2"
      >
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="w-full bg-gray-100 dark:bg-gray-950 rounded-full px-4 py-2 text-gray-900 dark:text-white outline-none border border-gray-200 dark:border-gray-800 placeholder:text-gray-400 dark:placeholder:text-gray-600"
          placeholder="Message..."
        />
        <button type="submit" className="text-pink-500 hover:text-pink-600">
          <Send className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
};

// --- AI STUDIO BİLEŞENİ ---
const AIStudio = ({ user, requireAuth }) => {
  return <div className="p-4 text-center text-gray-500">AI Studio (Demo)</div>;
};

// --- NAV ITEM COMPONENT (MOVED OUTSIDE APP) ---
const NavItem = ({
  tab,
  icon: Icon,
  label,
  activeTab,
  setActiveTab,
  requireAuth,
  setEditingPost,
  setShowPostModal,
  setShowOnboarding,
}) => (
  <button
    onClick={() => {
      if (tab === "post") {
        requireAuth(() => {
          setEditingPost(null);
          setShowPostModal(true);
        });
      } else if (tab === "profile") {
        requireAuth(() => {
          setShowOnboarding(true);
        });
      } else {
        setActiveTab(tab);
        window.scrollTo(0, 0);
      }
    }}
    className={`flex flex-col items-center justify-center w-full py-1 ${
      activeTab === tab ? "text-pink-500" : "text-gray-500 dark:text-gray-400"
    }`}
  >
    <Icon
      className={`h-6 w-6 ${activeTab === tab ? "fill-current" : ""}`}
      strokeWidth={activeTab === tab ? 2.5 : 2}
    />
    <span className="text-[10px] mt-0.5 font-medium">{label}</span>
  </button>
);

export default function App() {
  const [activeTab, setActiveTab] = useState("feed");
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [activeChat, setActiveChat] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [lastDoc, setLastDoc] = useState(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setUser({
            id: currentUser.uid,
            email: currentUser.email,
            ...userData,
          });
        } else {
          setUser({
            id: currentUser.uid,
            email: currentUser.email,
            name: currentUser.displayName || "New Member",
            image:
              currentUser.photoURL ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.uid}`,
            verified: false,
          });
        }
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const fetchPosts = async (isLoadMore = false) => {
    setLoadingPosts(true);
    try {
      let q = query(
        collection(db, "posts"),
        orderBy("createdAt", "desc"),
        limit(20)
      );
      if (isLoadMore && lastDoc) {
        q = query(
          collection(db, "posts"),
          orderBy("createdAt", "desc"),
          startAfter(lastDoc),
          limit(20)
        );
      }
      const snapshot = await getDocs(q);
      const newPosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (snapshot.docs.length > 0) {
        setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
        if (isLoadMore) {
          setPosts((prev) => [...prev, ...newPosts]);
        } else {
          setPosts(newPosts);
        }
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
    setLoadingPosts(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleAuthSubmit = async (e, email, password) => {
    e.preventDefault();
    try {
      if (authMode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
        setShowAuthModal(false);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        setShowAuthModal(false);
        setShowOnboarding(true);
      }
    } catch (error) {
      alert("Hata: " + error.message);
    }
  };

  const handleCompleteOnboarding = async (profileData) => {
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, {
        displayName: profileData.name,
        photoURL: profileData.image,
      });
      await setDoc(
        doc(db, "users", auth.currentUser.uid),
        {
          displayName: profileData.name,
          photoURL: profileData.image,
          bio: profileData.bio,
          socials: {
            instagram: profileData.instagram,
            twitter: profileData.twitter,
            onlyfans: profileData.onlyfans,
          },
          email: auth.currentUser.email,
          uid: auth.currentUser.uid,
        },
        { merge: true }
      );
      window.location.reload();
    }
    setShowOnboarding(false);
  };

  const handleLogout = async () => {
    if (window.confirm("Çıkış yapmak istiyor musun?")) {
      await signOut(auth);
      setActiveChat(null);
    }
  };

  const handlePostAd = async (formData) => {
    if (!user) return;
    try {
      const postData = {
        ownerId: user.id,
        name: user.name,
        handle:
          "@" +
          (user.name ? user.name.replace(/\s/g, "").toLowerCase() : "user"),
        image: user.image,
        verified: user.verified,
        boosted: formData.isBoosted,
        urgent: formData.isUrgent,
        type: formData.type,
        location: formData.location,
        desc: formData.desc,
        tags: ["New", formData.type],
        createdAt: Date.now(),
        followers: "New",
        socials: user.socials || {},
      };
      await addDoc(collection(db, "posts"), postData);
      setShowPostModal(false);
      setEditingPost(null);
      fetchPosts();
    } catch (error) {
      alert("İlan gönderilemedi.");
    }
  };

  const handleDelete = async (postId) => {
    if (window.confirm("İlanı silmek istiyor musunuz?")) {
      try {
        await deleteDoc(doc(db, "posts", postId));
        setPosts(posts.filter((p) => p.id !== postId));
      } catch (error) {
        console.error("Silme hatası:", error);
      }
    }
  };

  const requireAuth = (action) => {
    if (user) action();
    else {
      setAuthMode("login");
      setShowAuthModal(true);
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesCategory = filter === "ALL" || post.type === filter;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      (post.name && post.name.toLowerCase().includes(searchLower)) ||
      (post.desc && post.desc.toLowerCase().includes(searchLower));
    return matchesCategory && matchesSearch;
  });

  const boostedPosts = posts.filter((p) => p.boosted);

  if (authLoading)
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader2 className="h-10 w-10 text-pink-500 animate-spin" />
      </div>
    );

  return (
    <div
      className={`min-h-screen font-sans selection:bg-pink-500 selection:text-white pb-24 md:pb-0 transition-colors duration-300 ${
        darkMode ? "dark bg-gray-900 text-gray-200" : "bg-gray-50 text-gray-900"
      }`}
    >
      <TailwindCDN />

      {/* ÜST NAVBAR (SADELEŞTİRİLMİŞ) */}
      <nav className="sticky top-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => {
              setActiveTab("feed");
              window.scrollTo(0, 0);
            }}
          >
            <div className="bg-gradient-to-tr from-pink-600 to-purple-600 p-1.5 rounded-lg shadow-lg shadow-pink-600/20">
              <Users className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
              Link<span className="text-pink-500">Up</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {darkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
            {!user && (
              <button
                onClick={() => {
                  setAuthMode("login");
                  setShowAuthModal(true);
                }}
                className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg shadow-pink-600/20"
              >
                Login
              </button>
            )}
            {user && (
              <div className="hidden md:flex items-center gap-3">
                <span className="text-sm font-bold">{user.name}</span>
                <button
                  onClick={() => {
                    if (window.confirm("Exit?")) signOut(auth);
                  }}
                  className="text-red-500"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* İÇERİK ALANI */}
      {activeTab === "feed" && (
        <>
          <div className="relative bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300 pt-4">
            <div className="max-w-6xl mx-auto px-4 pb-4">
              <div className="relative group w-full mb-4">
                <div className="relative flex bg-white dark:bg-gray-950 rounded-xl items-center p-2 border border-gray-200 dark:border-gray-800 focus-within:border-pink-500 w-full transition-colors">
                  <Search className="h-5 w-5 text-gray-400 ml-2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search creators, cities, services..."
                    className="bg-transparent border-none text-gray-900 dark:text-white px-3 py-1 focus:ring-0 outline-none w-full placeholder:text-gray-400 text-sm"
                  />
                </div>
              </div>

              <Spotlight
                posts={boostedPosts}
                onProfileClick={(post) =>
                  requireAuth(() => setSelectedProfile(post))
                }
              />

              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                <button
                  onClick={() => setFilter("ALL")}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold border whitespace-nowrap transition-colors ${
                    filter === "ALL"
                      ? "bg-gray-900 text-white dark:bg-white dark:text-black border-transparent"
                      : "bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400"
                  }`}
                >
                  All
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setFilter(cat.id)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold border whitespace-nowrap flex items-center gap-2 transition-colors ${
                      filter === cat.id
                        ? "bg-pink-600 border-pink-600 text-white"
                        : "bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <main className="max-w-6xl mx-auto px-4 py-4">
            {loadingPosts ? (
              <div className="text-center py-20 text-gray-500">Loading...</div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-gray-300 dark:border-gray-800 rounded-2xl">
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  No ads found.
                </p>
                <button
                  onClick={() => requireAuth(() => setShowPostModal(true))}
                  className="text-pink-500 font-bold hover:underline"
                >
                  Post Ad
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPosts.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => requireAuth(() => setSelectedProfile(post))}
                    className={`relative bg-white dark:bg-gray-900 rounded-2xl p-4 border transition-all active:scale-95 duration-200 cursor-pointer flex flex-col group ${
                      post.boosted
                        ? "border-yellow-500/50 shadow-[0_0_10px_rgba(234,179,8,0.1)]"
                        : "border-gray-200 dark:border-gray-800"
                    }`}
                  >
                    <div className="absolute -top-2.5 left-4 flex gap-2">
                      {post.boosted && (
                        <div className="bg-yellow-500 text-black text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                          <Zap className="h-3 w-3 fill-black" /> PROMOTED
                        </div>
                      )}
                      {post.urgent && (
                        <div className="bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1 animate-pulse">
                          <Flame className="h-3 w-3 fill-white" /> URGENT
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mb-3 mt-2">
                      <img
                        src={post.image}
                        className={`h-10 w-10 rounded-full object-cover border-2 ${
                          post.boosted
                            ? "border-yellow-500"
                            : "border-gray-200 dark:border-gray-700"
                        }`}
                      />
                      <div>
                        <h3
                          className={`font-bold text-sm flex items-center gap-1 ${
                            post.boosted
                              ? "text-yellow-600 dark:text-yellow-500"
                              : "text-gray-900 dark:text-white"
                          }`}
                        >
                          {post.name}{" "}
                          {post.verified && (
                            <CheckCircle className="h-3 w-3 text-blue-500" />
                          )}
                        </h3>
                        <div className="flex items-center gap-1 text-[10px] text-gray-500">
                          <MapPin className="h-2 w-2 text-yellow-500" />{" "}
                          {post.location}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-xs leading-relaxed mb-3 line-clamp-3">
                      {post.desc}
                    </p>
                    <div className="grid grid-cols-2 gap-2 mt-auto">
                      <button className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white py-1.5 rounded-lg text-xs font-bold">
                        Profile
                      </button>
                      <button className="bg-pink-600 text-white py-1.5 rounded-lg text-xs font-bold">
                        Message
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {/* PAGINATION BUTTON */}
            <div className="mt-8 text-center">
              <button
                onClick={() => fetchPosts(true)}
                disabled={loadingPosts}
                className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-sm font-bold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                {loadingPosts ? "Loading..." : "Load More"}
              </button>
            </div>
          </main>

          <div className="fixed bottom-24 right-4 z-30 md:hidden">
            <button
              onClick={generateFakeData}
              className="bg-red-600/80 text-white p-2 rounded-full shadow-lg backdrop-blur-sm"
            >
              <Database className="h-5 w-5" />
            </button>
          </div>
        </>
      )}

      {activeTab === "ai-studio" && (
        <div className="flex items-center justify-center h-[80vh] text-gray-500">
          AI Studio Coming Soon...
        </div>
      )}
      {activeTab === "chat" && (
        <div className="flex items-center justify-center h-[80vh] text-gray-500">
          Messages Coming Soon...
        </div>
      )}

      {/* ALT NAVİGASYON BAR (MOBİL İÇİN) */}
      <div className="md:hidden fixed bottom-0 w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 flex justify-around items-center z-50 safe-area-bottom pb-1">
        <NavItem
          tab="feed"
          icon={Home}
          label="Home"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          requireAuth={requireAuth}
          setEditingPost={setEditingPost}
          setShowPostModal={setShowPostModal}
          setShowOnboarding={setShowOnboarding}
        />
        <NavItem
          tab="ai-studio"
          icon={Wand2}
          label="AI Studio"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          requireAuth={requireAuth}
          setEditingPost={setEditingPost}
          setShowPostModal={setShowPostModal}
          setShowOnboarding={setShowOnboarding}
        />

        {/* ORTA EKLE BUTONU */}
        <div className="relative -top-5">
          <button
            onClick={() =>
              requireAuth(() => {
                setEditingPost(null);
                setShowPostModal(true);
              })
            }
            className="bg-gradient-to-tr from-pink-600 to-purple-600 p-4 rounded-full shadow-lg shadow-pink-600/30 text-white transform transition-transform active:scale-95"
          >
            <PlusSquare className="h-6 w-6" />
          </button>
        </div>

        <NavItem
          tab="chat"
          icon={MessageCircle}
          label="Chat"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          requireAuth={requireAuth}
          setEditingPost={setEditingPost}
          setShowPostModal={setShowPostModal}
          setShowOnboarding={setShowOnboarding}
        />
        <NavItem
          tab="profile"
          icon={User}
          label="Profile"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          requireAuth={requireAuth}
          setEditingPost={setEditingPost}
          setShowPostModal={setShowPostModal}
          setShowOnboarding={setShowOnboarding}
        />
      </div>

      {/* --- MODALLAR --- */}
      {showAuthModal && (
        <AuthModal
          mode={authMode}
          setMode={setAuthMode}
          onClose={() => setShowAuthModal(false)}
          onSubmit={handleAuthSubmit}
        />
      )}

      {showOnboarding && (
        <OnboardingModal
          onComplete={handleCompleteOnboarding}
          generateBio={generateBioWithGemini}
          initialData={user}
        />
      )}

      {showPostModal && (
        <PostModal
          onClose={() => setShowPostModal(false)}
          onSubmit={handlePostAd}
          initialData={editingPost}
        />
      )}

      {selectedProfile && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/90 backdrop-blur-sm z-[70] flex items-center justify-center p-4 transition-colors">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-sm relative p-6 shadow-2xl">
            <button
              onClick={() => setSelectedProfile(null)}
              className="absolute top-4 right-4 text-gray-500 dark:text-white hover:text-gray-800 dark:hover:text-gray-300"
            >
              <X />
            </button>
            <div className="text-center mt-8">
              <img
                src={selectedProfile.image}
                className="h-24 w-24 rounded-full mx-auto mb-4 border-4 border-white dark:border-gray-800 shadow-lg"
              />
              <h2 className="text-2xl text-gray-900 dark:text-white font-bold">
                {selectedProfile.name}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {selectedProfile.bio || selectedProfile.desc}
              </p>
              <div className="grid grid-cols-3 gap-2 mb-6">
                {selectedProfile.socials?.instagram && (
                  <a
                    href={`https://instagram.com/${selectedProfile.socials.instagram}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-col items-center bg-gray-100 dark:bg-gray-800 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 transition-colors"
                  >
                    <Instagram className="h-4 w-4 text-pink-500 mb-1" />
                    <span className="text-[10px] text-gray-600 dark:text-gray-300">
                      Insta
                    </span>
                  </a>
                )}
                {selectedProfile.socials?.twitter && (
                  <a
                    href={`https://twitter.com/${selectedProfile.socials.twitter}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-col items-center bg-gray-100 dark:bg-gray-800 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 transition-colors"
                  >
                    <Twitter className="h-4 w-4 text-blue-400 mb-1" />
                    <span className="text-[10px] text-gray-600 dark:text-gray-300">
                      Twitter
                    </span>
                  </a>
                )}
                {selectedProfile.socials?.onlyfans && (
                  <a
                    href={selectedProfile.socials.onlyfans}
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-col items-center bg-gray-100 dark:bg-gray-800 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 transition-colors"
                  >
                    <LinkIcon className="h-4 w-4 text-blue-500 mb-1" />
                    <span className="text-[10px] text-gray-600 dark:text-gray-300">
                      Links
                    </span>
                  </a>
                )}
              </div>
              <button
                onClick={() => {
                  setSelectedProfile(null);
                  setActiveChat({
                    ...selectedProfile,
                    ownerId: selectedProfile.ownerId,
                  });
                }}
                className="w-full bg-pink-600 text-white py-3 rounded-xl font-bold shadow-lg"
              >
                Message
              </button>
            </div>
          </div>
        </div>
      )}

      {activeChat && (
        <ChatModal
          activeChat={activeChat}
          setActiveChat={setActiveChat}
          user={user}
        />
      )}

      {showPremiumModal && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/90 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 text-center shadow-2xl">
            <Crown className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl text-gray-900 dark:text-white font-bold mb-2">
              Go Premium
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Get featured & more.
            </p>
            <button
              onClick={() => setShowPremiumModal(false)}
              className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white px-6 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
