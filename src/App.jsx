import React, { useState, useEffect } from "react";
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
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
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
} from "lucide-react";

// --- TASARIM KURTARICI (CDN) ---
// Bu satır, ayarlar bozuk olsa bile tasarımı zorla yükler.
const TailwindCDN = () => (
  <link
    href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
    rel="stylesheet"
  />
);

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

/* --- SAHTE VERİ OLUŞTURUCU --- */
const generateFakeData = async () => {
  // İsimler
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
  ];

  // Lokasyonlar
  const LOCATIONS = [
    "Miami, FL",
    "Los Angeles, CA",
    "New York, NY",
    "Las Vegas, NV",
    "London, UK",
    "Dubai, UAE",
    "Tulum, Mexico",
    "Austin, TX",
    "Bali, Indonesia",
    "Online",
    "Mykonos, Greece",
    "Ibiza, Spain",
  ];

  // 12 Farklı ve Gerçekçi Fotoğraf (Unsplash)
  const AVATARS = [
    "https://imgur.com/6ZHmleV?auto=format&fit=crop&w=200&q=80",
    "https://imgur.com/hCLxmjh?auto=format&fit=crop&w=200&q=80",
  ];

  // İlan Metinleri
  const TEMPLATES = [
    {
      type: "COLLAB",
      text: "I'm in Miami for the weekend! Looking for a girl to shoot content with. I have an Airbnb with a pool. DM me! 📸💦",
    },
    {
      type: "S4S",
      text: "Doing mass S4S drops on my main page (150k subs). DM proof of purchase or swap. Let's grow together! 🔄📈",
    },
    {
      type: "TRAVEL",
      text: "Going to Dubai next month! Need a travel buddy to split hotel costs and take photos of each other. Serious inquiries only. ✈️🇦🇪",
    },
    {
      type: "SERVICE",
      text: "Professional photographer available in LA area. 4K video, fast edits, discreet. Special rates for new creators. DM for portfolio.",
    },
    {
      type: "HOUSING",
      text: "1 Room available in our Content House in Hills. $2500/mo. Pool, Gym, Studio included. Must be verified creator. 🏠✨",
    },
    {
      type: "AGENCY",
      text: "Top 1% Agency hiring new talent. We handle chatting, marketing & viral growth. No upfront fees. We scale you to 6 figures. 🚀💸",
    },
    {
      type: "COLLAB",
      text: "In Vegas for AVN awards! Who wants to shoot? G/G content only. I have my own equipment. ✨👯‍♀️",
    },
    {
      type: "S4S",
      text: "L4L (Like for Like) on my latest post! Link in comments. Retweet for Retweet. Let's boost engagement! 🔥",
    },
    {
      type: "SERVICE",
      text: "Need a Chatter? I have 2 years of experience, I know how to sell. English/Spanish. Commission based. 💬💰",
    },
    {
      type: "TRAVEL",
      text: "Planning a trip to Tulum in January. Looking for 2-3 girls to rent a villa and create content for a week. 🌴🍹",
    },
  ];

  let count = 0;
  // 10 ADET İLAN EKLEME DÖNGÜSÜ
  for (let i = 0; i < 10; i++) {
    const randomName =
      NAMES[Math.floor(Math.random() * NAMES.length)] +
      " " +
      SURNAME_EXT[Math.floor(Math.random() * SURNAME_EXT.length)];
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

export default function App() {
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [activeChat, setActiveChat] = useState(null);
  const [editingPost, setEditingPost] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          id: currentUser.uid,
          email: currentUser.email,
          name: currentUser.displayName || "New Member",
          image:
            currentUser.photoURL ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.uid}`,
          verified: false,
        });
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const livePosts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(livePosts);
        setLoadingPosts(false);
      },
      (error) => {
        setLoadingPosts(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleAuthSubmit = async (e, email, password) => {
    e.preventDefault();
    try {
      if (authMode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
        setShowAuthModal(false);
      } else {
        const cred = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
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
        socials: {},
      };
      await addDoc(collection(db, "posts"), postData);
      setShowPostModal(false);
      setEditingPost(null);
    } catch (error) {
      alert("İlan gönderilemedi.");
    }
  };

  const handleDelete = async (postId) => {
    if (window.confirm("İlanı silmek istiyor musunuz?")) {
      try {
        await deleteDoc(doc(db, "posts", postId));
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

  const generateBioWithGemini = async (keywords) => {
    if (!keywords) return "Anahtar kelime giriniz.";
    if (!apiKey) return "API Key eksik.";
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: `Write a bio for creator. Keywords: ${keywords}` },
                ],
              },
            ],
          }),
        }
      );
      const data = await response.json();
      return (
        data.candidates?.[0]?.content?.parts?.[0]?.text || "Bio oluşturulamadı."
      );
    } catch (error) {
      return "Servis kapalı.";
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesCategory = filter === "ALL" || post.type === filter;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      (post.name && post.name.toLowerCase().includes(searchLower)) ||
      (post.desc && post.desc.toLowerCase().includes(searchLower)) ||
      (post.location && post.location.toLowerCase().includes(searchLower));
    return matchesCategory && matchesSearch;
  });

  const boostedPosts = posts.filter((p) => p.boosted);

  if (authLoading)
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="h-10 w-10 text-pink-500 animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans selection:bg-pink-500 selection:text-white pb-20 md:pb-0">
      <TailwindCDN />

      <nav className="sticky top-0 z-40 bg-gray-900/90 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => window.location.reload()}
          >
            <div className="bg-gradient-to-tr from-pink-600 to-purple-600 p-2 rounded-lg shadow-lg shadow-pink-600/20">
              <Users className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-lg font-bold text-white tracking-tight">
              Link<span className="text-pink-500">Up</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden md:block text-right">
                  <div className="text-xs text-gray-400">Hi,</div>
                  <div className="text-sm font-bold text-white max-w-[100px] truncate">
                    {user.name}
                  </div>
                </div>
                <img
                  src={user.image}
                  className="h-9 w-9 rounded-full object-cover border border-gray-600"
                  title="Profile"
                />
                <button
                  onClick={handleLogout}
                  className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white p-2 rounded-full transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>

                <button
                  onClick={() => {
                    setEditingPost(null);
                    setShowPostModal(true);
                  }}
                  className="hidden md:flex bg-white hover:bg-gray-200 text-gray-900 px-4 py-2 rounded-full text-sm font-bold items-center gap-2 transition-transform hover:scale-105"
                >
                  <PlusSquare className="h-4 w-4" /> Post Ad
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setAuthMode("login");
                    setShowAuthModal(true);
                  }}
                  className="text-sm font-bold text-gray-300 hover:text-white px-3 py-2"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setAuthMode("signup");
                    setShowAuthModal(true);
                  }}
                  className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg shadow-pink-600/20"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="relative bg-gray-900 border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {boostedPosts.length > 0 && (
            <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-yellow-500" />
                <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">
                  Spotlight
                </h3>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                {boostedPosts.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => requireAuth(() => setSelectedProfile(post))}
                    className="min-w-[280px] bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 p-4 rounded-xl cursor-pointer hover:border-pink-500 transition-all shadow-lg relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 bg-yellow-500 text-black text-[10px] font-bold px-2 py-1 rounded-bl-lg z-10">
                      FEATURED
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={post.image}
                        className="h-12 w-12 rounded-full object-cover border-2 border-yellow-500/50"
                      />
                      <div>
                        <h4 className="font-bold text-white text-sm truncate w-32">
                          {post.name}
                        </h4>
                        <div className="text-xs text-gray-400 flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {post.location}
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-300 line-clamp-2 mb-3">
                      {post.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="relative group w-full md:w-auto">
              <div className="relative flex bg-gray-950 rounded-xl items-center p-1 border border-gray-800 focus-within:border-pink-500 w-full md:w-96">
                <Search className="h-4 w-4 text-gray-500 ml-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="bg-transparent border-none text-white px-3 py-2 focus:ring-0 outline-none w-full placeholder:text-gray-600 text-sm"
                  style={{ color: "white" }}
                />
              </div>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              <button
                onClick={() => setFilter("ALL")}
                className={`px-4 py-2 rounded-full text-xs font-bold border whitespace-nowrap ${
                  filter === "ALL"
                    ? "bg-white text-black border-white"
                    : "bg-gray-950 border-gray-700 text-gray-400 hover:text-white"
                }`}
              >
                All
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setFilter(cat.id)}
                  className={`px-4 py-2 rounded-full text-xs font-bold border whitespace-nowrap flex items-center gap-2 ${
                    filter === cat.id
                      ? "bg-pink-600 border-pink-600 text-white"
                      : "bg-gray-950 border-gray-700 text-gray-400 hover:text-white"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {loadingPosts ? (
          <div className="text-center py-20 text-gray-500">Loading...</div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-gray-800 rounded-2xl">
            <p className="text-gray-400 mb-4">No ads found.</p>
            <button
              onClick={() => requireAuth(() => setShowPostModal(true))}
              className="text-pink-500 font-bold hover:underline"
            >
              Post Ad
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => requireAuth(() => setSelectedProfile(post))}
                className={`relative bg-gray-900 rounded-2xl p-5 border transition-all hover:-translate-y-1 hover:shadow-xl cursor-pointer flex flex-col group ${
                  post.boosted
                    ? "border-pink-500/50 shadow-lg shadow-pink-900/10"
                    : "border-gray-800 hover:border-gray-700"
                }`}
              >
                {user && user.id === post.ownerId && (
                  <div className="absolute top-4 right-4 flex gap-2 z-20">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(post.id);
                      }}
                      className="p-1.5 bg-gray-800 text-gray-400 hover:text-red-400 rounded border border-gray-700 hover:bg-gray-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                )}
                <div className="absolute -top-3 left-5 flex gap-2">
                  {post.boosted && (
                    <div className="bg-pink-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                      <Zap className="h-3 w-3 fill-white" /> PROMOTED
                    </div>
                  )}
                  {post.urgent && (
                    <div className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1 animate-pulse">
                      <Flame className="h-3 w-3 fill-white" /> URGENT
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3 mb-4 mt-2">
                  <img
                    src={post.image}
                    className="h-11 w-11 rounded-full object-cover border border-gray-700"
                  />
                  <div>
                    <h3 className="font-bold text-white text-sm flex items-center gap-1">
                      {post.name}{" "}
                      {post.verified && (
                        <CheckCircle className="h-3.5 w-3.5 text-blue-400" />
                      )}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <MapPin className="h-3 w-3" /> {post.location}
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <span className="text-[10px] font-bold px-2 py-1 rounded border bg-gray-800 border-gray-700 text-gray-300">
                    {CATEGORIES.find((c) => c.id === post.type)?.label}
                  </span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-4 flex-grow line-clamp-3">
                  {post.desc}
                </p>
                <div className="grid grid-cols-2 gap-2 pt-4 border-t border-gray-800/50 mt-auto">
                  <button className="bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg text-xs font-bold transition-colors">
                    View Profile
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      requireAuth(() => setActiveChat(post));
                    }}
                    className="bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-pink-600/20"
                  >
                    <MessageCircle className="h-3.5 w-3.5" /> Message
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <div className="fixed bottom-4 left-4 z-50">
        <button
          onClick={generateFakeData}
          className="bg-red-600/80 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg backdrop-blur-sm border border-red-500"
        >
          <Database className="h-4 w-4" /> ⚠️ DEV: Add Fake Data (x10)
        </button>
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
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[70] flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-sm relative p-6">
            <button
              onClick={() => setSelectedProfile(null)}
              className="absolute top-4 right-4 text-white"
            >
              <X />
            </button>
            <div className="text-center mt-8">
              <img
                src={selectedProfile.image}
                className="h-24 w-24 rounded-full mx-auto mb-4"
              />
              <h2 className="text-2xl text-white font-bold">
                {selectedProfile.name}
              </h2>
              <p className="text-gray-400 mb-4">{selectedProfile.desc}</p>
              <button className="w-full bg-pink-600 text-white py-3 rounded-xl font-bold">
                Message
              </button>
            </div>
          </div>
        </div>
      )}
      {activeChat && (
        <div className="fixed bottom-0 right-0 md:right-4 w-full md:w-80 h-[400px] bg-gray-900 border border-gray-800 md:rounded-t-2xl z-[100] flex flex-col">
          <div className="p-4 border-b border-gray-800 flex justify-between bg-gray-950">
            <span className="text-white font-bold">{activeChat.name}</span>
            <button
              onClick={() => setActiveChat(null)}
              className="text-gray-500"
            >
              <X />
            </button>
          </div>
          <div className="flex-1 bg-gray-900/90 p-4 text-center text-gray-500">
            Start chatting...
          </div>
          <div className="p-3 border-t border-gray-800">
            <input
              className="w-full bg-gray-950 rounded-full px-4 py-2 text-white outline-none border border-gray-800"
              style={{ color: "white", backgroundColor: "#1f2937" }}
              placeholder="Message..."
            />
          </div>
        </div>
      )}
      {showPremiumModal && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center">
          <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800 text-center">
            <Crown className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl text-white font-bold mb-2">Go Premium</h2>
            <p className="text-gray-400 mb-6">Get featured & more.</p>
            <button
              onClick={() => setShowPremiumModal(false)}
              className="bg-gray-800 text-white px-6 py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function AuthModal({ mode, setMode, onClose, onSubmit }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-sm p-8 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
        <h2 className="text-2xl font-bold text-white text-center mb-6">
          {mode === "login" ? "Welcome Back" : "Join LinkUp"}
        </h2>
        <form
          onSubmit={(e) => onSubmit(e, email, password)}
          className="space-y-4"
        >
          {/* ZORLA BEYAZ YAZI */}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-pink-500"
            style={{ color: "white", backgroundColor: "#1f2937" }}
            placeholder="Email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-pink-500"
            style={{ color: "white", backgroundColor: "#1f2937" }}
            placeholder="Password"
            required
          />
          <button className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3.5 rounded-xl">
            {mode === "login" ? "Login" : "Sign Up"}
          </button>
        </form>
        <div className="mt-6 text-center text-sm">
          <button
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="text-pink-500 font-bold hover:underline"
          >
            {mode === "login" ? "Create Account" : "Login instead"}
          </button>
        </div>
      </div>
    </div>
  );
}

function OnboardingModal({ onComplete }) {
  const [data, setData] = useState({
    name: "",
    image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.floor(
      Math.random() * 1000
    )}`,
  });
  return (
    <div className="fixed inset-0 bg-black/95 z-[80] flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-6">Setup Profile</h2>
        <img
          src={data.image}
          className="h-24 w-24 rounded-full mx-auto mb-4 bg-gray-800 border-4 border-gray-800"
        />
        {/* ZORLA BEYAZ YAZI */}
        <input
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
          className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm outline-none mb-6"
          style={{ color: "white", backgroundColor: "#1f2937" }}
          placeholder="Display Name"
        />
        <button
          onClick={() => onComplete(data)}
          className="w-full bg-pink-600 text-white font-bold py-3.5 rounded-xl"
        >
          Finish
        </button>
      </div>
    </div>
  );
}

function PostModal({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    type: "COLLAB",
    location: "",
    desc: "",
    isBoosted: false,
    isUrgent: false,
  });
  return (
    <div className="fixed inset-0 bg-black/80 z-[80] flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white"
        >
          <X />
        </button>
        <h3 className="text-xl font-bold text-white mb-6">New Post</h3>
        <div className="space-y-4">
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm outline-none"
            style={{ color: "white", backgroundColor: "#1f2937" }}
          >
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
          {/* ZORLA BEYAZ YAZI */}
          <input
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            placeholder="Location"
            className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm outline-none"
            style={{ color: "white", backgroundColor: "#1f2937" }}
          />
          {/* ZORLA BEYAZ YAZI */}
          <textarea
            rows="3"
            value={formData.desc}
            onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
            placeholder="Details..."
            className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm outline-none"
            style={{ color: "white", backgroundColor: "#1f2937" }}
          ></textarea>
          <div className="flex gap-2 text-white text-sm font-bold">
            <div
              onClick={() =>
                setFormData({ ...formData, isBoosted: !formData.isBoosted })
              }
              className={`flex-1 border p-3 rounded-xl cursor-pointer flex items-center gap-2 ${
                formData.isBoosted
                  ? "border-pink-500 bg-pink-900/20"
                  : "border-gray-700"
              }`}
            >
              <CheckCircle
                className={`h-4 w-4 ${
                  formData.isBoosted ? "text-pink-500" : "text-gray-600"
                }`}
              />{" "}
              Pin Ad
            </div>
            <div
              onClick={() =>
                setFormData({ ...formData, isUrgent: !formData.isUrgent })
              }
              className={`flex-1 border p-3 rounded-xl cursor-pointer flex items-center gap-2 ${
                formData.isUrgent
                  ? "border-red-500 bg-red-900/20"
                  : "border-gray-700"
              }`}
            >
              <CheckCircle
                className={`h-4 w-4 ${
                  formData.isUrgent ? "text-red-500" : "text-gray-600"
                }`}
              />{" "}
              Urgent
            </div>
          </div>
          <button
            onClick={() => onSubmit(formData)}
            className="w-full bg-white text-black font-bold py-3 rounded-xl"
          >
            Post Now
          </button>
        </div>
      </div>
    </div>
  );
}
